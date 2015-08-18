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
            'start': config.get('time.start'),//moment.utc().subtract(1, 'month').unix(),
            'end': config.get('time.end'),//moment.utc().unix(),
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
 *
 * @returns {*}
 * @private
 */
var _addTaskParams = function _addTaskParams(reqParams, task) {
    for (var taskProp in task) {
        if (task.hasOwnProperty(taskProp)) {
            // dont add unsupported properties
            var ignoreProps = ["id,child"];
            
            if(ignoreProps.indexOf(taskProp) !== -1){
                continue;
            }
            //copy the 'then' object to params
            if (taskProp === 'then') {
                reqParams.then =
                    task.then;
            }
            else if (taskProp === 'start'){
                reqParams.json.start =
                    task[taskProp];
            }
            else if (taskProp === 'end'){
                reqParams.json.end =
                    task[taskProp];
            }
             else {
                //write all other props to params
                reqParams.json.parameters.parameters[taskProp] =
                    task[taskProp];
            }
        }
    }
    return reqParams;
};

/**
 * _getName - build a name property based on
 * available task properties
 *
 * @param obj - task object
 * @returns {string}
 * @private
 */
var _getName = function _getName(obj){
    if(obj.name){
        return obj.name;
    }
    if(obj.target && obj.then && obj.then.target){
        return obj.target + "-THEN-" + obj.then.target;
    }
    if(obj.target && obj.filter){
        return obj.target + "--" + obj.filter;
    }
    if(obj.target && !obj.filter){
        return obj.target;
    }
    if(!obj.target && !obj.filter && obj.interval && obj.span){
        return obj.interval + "--span_" + obj.span;
    }
    return "not specified";
};

/**
 * _processNativeNestedTask
 *
 * @param taskType - string - always "freqDist"
 * @param eachTask - task object derived from config
 * @returns {Array}
 * @private
 */
var _processNativeNestedTask = function _processNativeNestedTask(taskType, eachTask){
    var out = [];
    var reqParams = getDefaultTaskObj();

    reqParams.json.parameters.analysis_type = taskType;
    reqParams.name = _getName(eachTask);
    delete (eachTask.name);

    if (eachTask.filter) {
        reqParams.json.filter = eachTask.filter;
        delete (eachTask.filter);
    }

    // do we have a nested nested?
    var grandChild = eachTask.child.child || undefined;

    if (grandChild) {
        delete (eachTask.child.child);
    }

    if (eachTask.child) {
        reqParams.json.parameters.child = {};
        reqParams.json.parameters.child.analysis_type = taskType;
        reqParams.json.parameters.child.parameters = eachTask.child;

         if (grandChild) {
             reqParams.json.parameters.child.child = {};
             reqParams.json.parameters.child.child.analysis_type = taskType;
             reqParams.json.parameters.child.child.parameters = grandChild;
         }
        delete (eachTask.child);
    }
    reqParams = _addTaskParams(reqParams, eachTask);
    out.push(reqParams);
    //log.info(JSON.stringify(allTasks, null, 4));
    return out;
};



/**
 * _processTask - process a non-merged task
 *
 * @param taskType - string - freqDist or timeSeries
 * @param eachTask - obj - the task object
 * @returns {Array}
 * @private
 */
var _processTask = function _processTask(taskType, eachTask){
    var out = [];
    var reqParams = getDefaultTaskObj();
    reqParams.json.parameters.analysis_type = taskType;
    // name property
    reqParams.name = _getName(eachTask);
    delete (eachTask.name);

    if (eachTask.filter) {
        reqParams.json.filter = eachTask.filter;
        delete (eachTask.filter);
    }

    reqParams = _addTaskParams(reqParams, eachTask);
    out.push(reqParams);
    return out;
};

/**
 * _processMergedTask - process a merhed task
 *
 * @param taskType - string - freqDist or timeSeries
 * @param name - string - the name of the task
 * @param mergeObject - obj - the merge task object
 * @returns {Array}
 * @private
 */
var _processMergedTask = function _processMergedTask(taskType, name, mergeObject){
    var out = [];
    var cacheId = mergeCache.create();
    for (var mergeTasks in mergeObject[name]) {
        if (mergeObject[name].hasOwnProperty(mergeTasks)) {
            //shorten
            var eachTask = mergeObject[name][mergeTasks];
            var reqParams = getDefaultTaskObj();
            reqParams.name = name;
            reqParams.json.parameters.analysis_type = taskType;

            //merge key
            var mergeKey = undefined;
            if(eachTask.id){
                mergeKey = eachTask.id;
            } else if(eachTask.target && eachTask.filter){
                mergeKey = eachTask.target + "_" + eachTask.filter;
            } else if(eachTask.target && !eachTask.filter){
                mergeKey = eachTask.target;
            }

            delete (eachTask.id);

            //filter property
            if (eachTask.filter) {
                reqParams.json.filter = eachTask.filter;
                delete (eachTask.filter);
            }

            reqParams = _addTaskParams(reqParams, eachTask);

            if (mergeCache.addKey(cacheId, mergeKey) === false) {
                return [];
            }

            //attach a cache signature to the request
            reqParams.cache = {
                "cacheId": cacheId,
                "mergeKey": mergeKey
            };
            out.push(reqParams);
        }
    }
    return out;
};

/**
 * buildFromConfig - iterate config file and build
 * array of request objects based on task type.
 *
 * Tasks will be one of three formats.
 *
 * Merged queries (_processMergedTask):
 *
 *  {
 *    "task name": [
 *      {
 *        //task 1...
 *      },
 *      {
 *        //task 2...
 *      }
 *    ]
 *  }
 *
 * or not nested (_processTask):
 *
 *  {
 *     //task 1...
 *  },
 *  {
 *     //task 2...
 *  },
 *
 * or native nested (_processNativeNestedTask):
 *
 * todo
 *
 * @param (Obj) - tasks object read from config
 * @returns {Array} - array of request objects
 */
var buildFromConfig = function buildFromConfig(tasks) {

    tasks = tasks || configLoader.load();
    var allTasks = []
        ;

    function getType(obj) {
        return Object.prototype.toString.call(obj);
    }

    //merge array of objects
    function appendAll(dest, src) {
        var n;
        for (n = 0; n < src.length; ++n) {
            dest.push(src[n]);
        }
        return dest;
    }

    // taskType - freqDist or timeSeries
    for (var taskType in tasks) {
        //each task
        for (var task in tasks[taskType]) {
            //shorten
            var eachTask = tasks[taskType][task];
            //inspect the first key value to identify if
            //it is a merged object task
            var firstTaskKey = Object.keys(eachTask)[0];
            var firstTaskValue = eachTask[Object.keys(eachTask)[0]];
            var firstKeyValueType = getType(firstTaskValue);

            if(firstKeyValueType === "[object Array]"){
                appendAll(allTasks, _processMergedTask(taskType,
                    firstTaskKey, eachTask));
            } else if(eachTask.child){
                appendAll(allTasks, _processNativeNestedTask("freqDist"
                    , eachTask));
            } else {
                appendAll(allTasks, _processTask(taskType, eachTask));
            }
        }
    }
    //log.info(JSON.stringify(allTasks, null, 4));
    return allTasks;
};

/**
 * buildFromResponse - build request options obj from
 * the PYLON response.
 *
 * @param data
 * @param task - containing then object
 * @returns - array of request objects
 */
var buildFromResponse = function buildFromResponse(data, task) {

    if(data && data.error){ return []; }

    var secondaryTasks = []
        , results = data.analysis.results || {}
        , resultTarget = data.analysis.parameters.target || ""
        , cacheId = mergeCache.create() // create cache record
        , then = task.then // obj containing the next task
        ;

    //process result keys and build the secondary task obj
    for (var ind in results) {
        if (results.hasOwnProperty(ind)) {

            var reqParams = getDefaultTaskObj() //new req params obj
                , configFilter = ""
                ;

            // name property
            reqParams.name = task.name;

            //iterate the then params and push to the new req obj
            for (var thenInd in then) {
                if (then.hasOwnProperty(thenInd)) {

                    if(then.filter){
                        //build the filter ready to append
                        configFilter = "(" + then.filter + ") AND ";
                    }

                    reqParams.json.parameters.parameters[thenInd]
                        = then[thenInd];
                }
            }
            delete (reqParams.json.parameters.parameters.filter);

            //build secondary filter param
            reqParams.json.filter = configFilter + resultTarget + " "
                + operator.get(resultTarget) + '"' + results[ind].key + '"';

            //cache the merge key
            mergeCache.addKey(cacheId, results[ind].key);

            //attach a signature to the request
            reqParams.cache = {
                "cacheId": cacheId,
                "mergeKey": results[ind].key
            };
            //log.info(JSON.stringify(reqParams, null, 4));
            secondaryTasks.push(reqParams);
        }
    }
    return secondaryTasks;
};

exports.getDefaultTaskObj = getDefaultTaskObj;
exports.buildFromConfig = buildFromConfig;
exports.buildFromResponse = buildFromResponse;
