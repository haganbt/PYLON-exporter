'use strict';

var log = require('../utils/logger')
    , config = require('config')
    , moment = require('moment')
    , _ = require('lodash')
    , operator = require("../utils/operator")
    , configLoader = require("../utils/config")
    , tasks = configLoader.load()
    ;

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
 * buildFromConfig - iterate config file building
 * an 'options' object for each task.
 *
 * @returns {Array} - array of options objects
 */
var buildFromConfig = function buildFromConfig(tasks) {

    var allTasks = []
        ;

    log.info("Building requests from config...");

    //[1] type
    for (var analysisType in tasks) {
        if (tasks.hasOwnProperty(analysisType)) {

            //[2] tasks
            for (var taskKey in tasks[analysisType]) {
                if (tasks[analysisType].hasOwnProperty(taskKey)) {

                    var eachOptions = getDefaultTaskObj();

                    /*eslint-disable*/
                    eachOptions.json.parameters.analysis_type = analysisType;
                    /*eslint-enable*/

                    log.debug("TYPE: " + analysisType);

                    //primary filter config item
                    if(tasks[analysisType][taskKey].filter){
                        eachOptions.json.filter =
                            tasks[analysisType][taskKey].filter;

                        delete (tasks[analysisType][taskKey].filter);
                    }

                    //[3] task params
                    for (var paramKey in tasks[analysisType][taskKey]) {
                        if (tasks[analysisType][taskKey]
                                .hasOwnProperty(paramKey)) {

                            //copy the 'then' object to params
                            if (paramKey === 'then') {
                                eachOptions.then =
                                    tasks[analysisType][taskKey].then;
                            } else {
                                eachOptions.json.parameters.parameters[paramKey]
                                    = tasks[analysisType][taskKey][paramKey];
                            }

                        }
                    }
                    log.debug("Options generated: " +
                        JSON.stringify(eachOptions) + "\n");

                    allTasks.push(eachOptions);
                }
            }
        }
    }
    log.info("Completed building requets from config.");
    return allTasks;
};

/**
 * buildFromResponse - build request options obj from
 * the response of a PYLON response.
 *
 * @param data
 * @param then
 * @returns {Array}
 */
var buildFromResponse = function buildFromResponse(data, then) {

    if(data && data.error){ return []; }

    var secondaryTasks = []
        , results = data.analysis.results || {}
        , resultTarget = data.analysis.parameters.target || ""
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

            secondaryTasks.push(reqParams);
        }
    }
    //log.debug( "secondaryTasks: " + JSON.stringify(secondaryTasks));
    return secondaryTasks;
};

exports.getDefaultTaskObj = getDefaultTaskObj;
exports.buildFromConfig = buildFromConfig;
exports.buildFromResponse = buildFromResponse;
