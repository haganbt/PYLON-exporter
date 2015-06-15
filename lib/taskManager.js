'use strict';

var log = require('../utils/logger')
    , config = require('config')
    , moment = require('moment')
    , _ = require('lodash')
    , operator = require("../utils/operator")
    , configLoader = require("../utils/configLoader")
    ;

var mergeCache = require('./mergeCache');

/**
 * getDefaults - get default request parameters
 *
 * @returns {obj}
 */
var getDefaultTaskObj = function getDefaults() {
    return _.cloneDeep({
        'method': 'POST',
        'auth': {
            'user': config.get('auth.username'),
            'pass': config.get('auth.api_key')
        },
        'uri': 'https://api.datasift.com/v1/pylon/analyze',
        'json': {
            'hash': config.get('hash'),
            'start': moment.utc().subtract(1, 'months').unix(),
            'end': moment.utc().unix(),
            'parameters': {
                'analysis_type': 'freqDist',
                'parameters': {}
            }
        }
    });
};

/**
 * _addTaskParams - process each of the task parameters
 * and add them to the request object config
 *
 * @param reqParams - obj
 * @param tasks - obj
 * @returns {*}
 * @private
 */
var _addTaskParams = function _addTaskParams(reqParams, tasks) {
    for (var taskIndx in tasks) {
        if (tasks.hasOwnProperty(taskIndx)) {

            //copy the 'then' object to params
            if (taskIndx === 'then') {
                reqParams.then =
                    tasks.then;
            } else {
                reqParams.json.parameters.parameters[taskIndx] = tasks[taskIndx];
            }
        }
    }
    return reqParams;
};


/**
 * buildFromConfig - iterate config file building
 * an 'options' object for each task.
 *
 * @param (Obj) - optional tasks object
 * @returns {Array} - array of options objects
 */
var buildFromConfig = function buildFromConfig() {

    var tasks = configLoader.load()
        , allTasks = []
        ;

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    //[1] type
    for (var analysisType in tasks) {
        if (tasks.hasOwnProperty(analysisType)) {

            //[2] tasks
            for (var taskKey in tasks[analysisType]) {
                if (tasks[analysisType].hasOwnProperty(taskKey)) {

                    var reqParams = getDefaultTaskObj();

                    /*eslint-disable*/
                    reqParams.json.parameters.analysis_type = analysisType;
                    /*eslint-enable*/


                    //Is the task and array i.e. merge results?
                    if(isArray(tasks[analysisType][taskKey]) === true){

                        for (var mergeTasks in tasks[analysisType][taskKey]) {


                            //primary filter config item
                            if(tasks[analysisType][taskKey][mergeTasks].filter){
                                reqParams.json.filter =
                                    tasks[analysisType][taskKey][mergeTasks].filter;

                                delete (tasks[analysisType][taskKey][mergeTasks].filter);
                            }

                            //[3] task params
                            reqParams = _addTaskParams(reqParams,
                                tasks[analysisType][taskKey][mergeTasks]);

                            allTasks.push(reqParams);
                        }
                    } else {

                        //primary filter config item
                        if(tasks[analysisType][taskKey].filter){
                            reqParams.json.filter =
                                tasks[analysisType][taskKey].filter;

                            delete (tasks[analysisType][taskKey].filter);
                        }

                        //[3] task params
                        reqParams = _addTaskParams(reqParams, tasks[analysisType][taskKey]);

                        allTasks.push(reqParams);
                    }
                }
            }
        }
    }
    return allTasks;
};

/**
 * buildFromResponse - build request options obj from
 * the PYLON response.
 *
 * @param data
 * @param then
 * @returns - array of request objects
 */
var buildFromResponse = function buildFromResponse(data, then) {

    if(data && data.error){ return []; }

    var secondaryTasks = []
        , results = data.analysis.results || {}
        , resultTarget = data.analysis.parameters.target || ""
        , mergeId = mergeCache.create() // create cache record
        ;

    //process result keys and build the secondary task obj
    for (var ind in results) {
        if (results.hasOwnProperty(ind)) {

            var reqParams = getDefaultTaskObj() //new req params obj
                , configFilter = ""
                ;

            //iterate the then params and push to the new req obj
            for (var thenInd in then) {
                if (then.hasOwnProperty(thenInd)) {

                    if(then.filter){
                        //build the filter ready to append
                        configFilter = then.filter + " AND ";
                    }

                    reqParams.json.parameters.parameters[thenInd]
                        = then[thenInd];
                }
            }

            delete (reqParams.json.parameters.parameters.filter);

            //build filter param
            reqParams.json.filter = configFilter + resultTarget + " "
                + operator.get(resultTarget) + '"' + results[ind].key + '"';

            //cache the merge key
            mergeCache.add(mergeId, results[ind].key);

            //attach a signature to the request
            reqParams.cache = {
                "cacheId": mergeId,
                "mergeKey": results[ind].key
            };

            secondaryTasks.push(reqParams);
        }
    }
    return secondaryTasks;
};

exports.getDefaultTaskObj = getDefaultTaskObj;
exports.buildFromConfig = buildFromConfig;
exports.buildFromResponse = buildFromResponse;
