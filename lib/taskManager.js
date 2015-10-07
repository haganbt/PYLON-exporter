'use strict';

var config = require('config')
    , moment = require('moment')
    , _ = require('lodash')
    , operator = require("../utils/operator")
    , configLoader = require("../utils/configLoader")
    , log = require("../utils/logger")
    , baseline = require("./baseline")
    ;

var mergeCache = require('./mergeCache');

/**
 * getDefaults - get default request parameters
 *
 * @returns {obj}
 */
var _getDefaultTaskObj = function _getDefaultTaskObj() {

    var start = moment.utc().subtract(32, 'days').unix();
    var end = moment.utc().unix();

    if (config.has('start')) {
        start = config.get('start');
    }
    if (config.has('end')) {
        end = config.get('end');
    }
    return _.cloneDeep({
        'method': 'POST',
        'auth': {
            'user': config.get('auth.username'),
            'pass': config.get('auth.api_key')
        },
        'uri': 'https://api.datasift.com/v1/pylon/analyze',
        'json': {
            'hash': config.get('hash'),
            'start': start,
            'end': end,
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
 * @param {reqObj} - the request object being built
 * @param {task} - the task object
 *
 * @returns {*}
 * @private
 */
var _addTaskParams = function _addTaskParams(reqObj, task) {
    for (var taskProp in task) {
        if (task.hasOwnProperty(taskProp)) {
            // dont add unsupported properties
            var ignoreProps = ["id,child"];
            if(ignoreProps.indexOf(taskProp) !== -1){
                continue;
            }

            //baseline
            if (taskProp === 'baseline') {
                reqObj.baseline = true;
                delete (task.baseline);
            }

            //copy the 'then' object to params
            if (taskProp === 'then') {
                reqObj.then =
                    task.then;
            } else {
                //start & end
                if (taskProp === 'start' || taskProp === 'end'){
                    reqObj.json[taskProp] = task[taskProp];
                }
                //write all other props to params
                reqObj.json.parameters.parameters[taskProp] =
                    task[taskProp];
            }
        }
    }
    return reqObj;
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
    if(obj.interval && obj.then && obj.then.target){
        return obj.interval + "-THEN-" + obj.then.target;
    }
    if(obj.target && obj.filter){
        return obj.target + "--" + obj.filter;
    }
    if(obj.target && !obj.filter){
        return obj.target;
    }
    //timeSeries
    if(!obj.target && !obj.filter && obj.interval && obj.span){
        return obj.interval + "--span_" + obj.span;
    }
    if(!obj.target && obj.filter && obj.interval){
        return obj.filter + "--span_" + obj.interval;
    }
    return "not specified";
};

/**
 * _getMergeKey - build a merge key property based on
 * available task properties
 *
 * @param obj - task object
 * @returns {string}
 * @private
 */
var _getMergeKey = function _getMergeKey(task){
    if(task.id){
        return task.id;
    } else if(task.target && task.filter){
        return task.target + "_" + task.filter;
    } else if(task.target && !task.filter){
        return task.target;
    } else if(task.interval && task.filter){
        return task.interval + "_" + task.filter;
    }
    log.error("Unable to generate merge key for cache.");
    return "not specified";
};

/**
 * _processNativeNested
 *
 * @param taskType - string - always "freqDist"
 * @param eachTask - task object derived from config
 * @returns {Array}
 * @private
 */
var _processNativeNested = function _processNativeNested(taskType, eachTask){
    var out = [];
    var reqObj = _getDefaultTaskObj();

    reqObj.json.parameters.analysis_type = taskType;
    reqObj.name = _getName(eachTask);
    delete (eachTask.name);

    if (eachTask.filter) {
        reqObj.json.filter = eachTask.filter;
        delete (eachTask.filter);
    }

    // do we have a nested nested?
    var grandChild = eachTask.child.child || undefined;

    if (grandChild) {
        delete (eachTask.child.child);
    }

    if (eachTask.child) {
        reqObj.json.parameters.child = {};
        reqObj.json.parameters.child.analysis_type = taskType;
        reqObj.json.parameters.child.parameters = eachTask.child;

         if (grandChild) {
             reqObj.json.parameters.child.child = {};
             reqObj.json.parameters.child.child.analysis_type = taskType;
             reqObj.json.parameters.child.child.parameters = grandChild;
         }
        delete (eachTask.child);
    }
    reqObj = _addTaskParams(reqObj, eachTask);
    out.push(reqObj);
    log.info(JSON.stringify(out, null, 4));
    return out;
};

/**
 * _processTask - process a non-merged task
 *
 * @param taskType - string - freqDist or timeSeries
 * @param {configTask} - the task object from config
 * @returns [Array]
 * @private
 */
var _processTask = function _processTask(taskType, configTask){
    var out = []
        , reqTask = _getDefaultTaskObj()
        ;

    //type
    reqTask.json.parameters.analysis_type = taskType;
    delete (configTask.type);

    //name
    reqTask.name = _getName(configTask);
    delete (configTask.name);

    //filter
    if (configTask.filter) {
        reqTask.json.filter = configTask.filter;
        delete (configTask.filter);
    }

    reqTask = _addTaskParams(reqTask, configTask);

    //baseline
    if(reqTask.baseline && reqTask.baseline === true){
        // Delete from the source task so it is not present
        // in both the source task and baseline task when
        // cloned. Injected once again to the baseline
        // task within baseline.getBaselineTask().
        delete(reqTask.baseline);

        var cacheId = mergeCache.create();

        var mergeKey = _getMergeKey(configTask);

        //cache the merge key
        mergeCache.addKey(cacheId, mergeKey);
        mergeCache.addKey(cacheId, mergeKey + "_BASELINE");
        //attach a signature to the request
        reqTask.cache = {
            "cacheId": cacheId,
            "mergeKey": mergeKey
        };

        //clone and prep baseline task
        var baselineTask = baseline.getBaselineTask(reqTask);
        out.push(baselineTask);
    }
    out.push(reqTask);
    return out;
};

/**
 * _processMergedTask - process a merged task
 *
 * @param taskType - string - freqDist or timeSeries
 * @param name - string - the name of the task
 * @param mergeObject - obj - the merge task object
 * @returns {Array}
 * @private
 */
var _processMerged = function _processMerged(taskType, name, mergeObject){
    var out = [];
    var cacheId = mergeCache.create();
    for (var mergeTasks in mergeObject[name]) {
        if (mergeObject[name].hasOwnProperty(mergeTasks)) {
            var eachTask = mergeObject[name][mergeTasks]; //shorten
            var reqTask = _getDefaultTaskObj();
            reqTask.name = name;
            reqTask.json.parameters.analysis_type = taskType;

            //merge key
            var mergeKey = _getMergeKey(eachTask);

            delete (eachTask.id);

            //filter
            if (eachTask.filter) {
                reqTask.json.filter = eachTask.filter;
                delete (eachTask.filter);
            }

            reqTask = _addTaskParams(reqTask, eachTask);

            if (mergeCache.addKey(cacheId, mergeKey) === false) {
                return [];
            }

            //attach a cache signature to the request
            reqTask.cache = {
                "cacheId": cacheId,
                "mergeKey": mergeKey
            };
            out.push(reqTask);
        }
    }
    return out;
};

/**
 * buildFromConfig - iterate config file and build
 * array of request objects based on task type.
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
                appendAll(allTasks, _processMerged(taskType,
                    firstTaskKey, eachTask));
            } else if(eachTask.child){
                appendAll(allTasks, _processNativeNested("freqDist"
                    , eachTask));
            } else {
                appendAll(allTasks, _processTask(taskType, eachTask));
            }
        }
    }
    log.info(JSON.stringify(allTasks, null, 4));
    return allTasks;
};

/**
 * _generateEndTs - generate end timeStamp based on
 * a given start TS and interval string e.g. week
 *
 * @param start - int - unix ts
 * @param interval - string
 * @returns {number} - unix ts
 */
var _generateEndTs = function _generateEndTs(start, interval){
    switch (interval) {
        case "minute":
            return start + 60 -1;
        case "hour":
            return start + (60 * 60 -1);
        case "day":
            return start + (60 * 60 * 24 -1);
        case "week":
            return start + (60 * 60 * 24 * 7 -1);
        case "month":
            return start + (60 * 60 * 24 * 30 -1);
        default:
            return start + (60 * 60 * 24 * 30 -1);
    }
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
        , resultTarget = data.analysis.parameters.target || undefined
        , cacheId = mergeCache.create() // create cache record
        , then = task.then // obj containing the next task
        , type = "freqDist"
        ;

    //then.type set?
    if(then && then.type){
        type = then.type;
        delete (then.type);
    }

    //process result keys and build the secondary task obj
    for (var ind in results) {
        if (results.hasOwnProperty(ind)) {

            var reqTask = _getDefaultTaskObj() //new req params obj
                , configFilter = ""
                ;

            //name property
            reqTask.name = task.name;

            //type property
            reqTask.json.parameters.analysis_type = type;

            //iterate the then params and push to the new req obj
            for (var thenInd in then) {
                if (then.hasOwnProperty(thenInd)) {

                    if(then.filter){
                        configFilter = "(" + then.filter + ") AND ";
                    }

                    reqTask.json.parameters.parameters[thenInd]
                            = then[thenInd];
                }
            }
            delete (reqTask.json.parameters.parameters.filter);

            //build secondary filter param
            if(resultTarget){
                reqTask.json.filter = configFilter + resultTarget + " "
                    + operator.get(resultTarget) + '"' + results[ind].key + '"';
            } else {
                //no target, must be a timeSeries (freqDist with an overridden child type)
                var startOverride = results[ind].key;
                var endOverride = _generateEndTs(startOverride, data.analysis.parameters.interval);

                //only override the start if its less than 32 days as timeSeries can
                //return an interval start outside of the max period. If that happens
                //the default obj value will be used ie now - 32 days
                if(startOverride > moment.utc().subtract(32, 'days').unix()){
                    reqTask.json.start = startOverride;
                }
                reqTask.json.end = endOverride;

                log.debug("Start: " + reqTask.json.start +
                    " " + moment.unix(reqTask.json.start).utc().format("DD-MMM h:mm:ss a"));
                log.debug("End:   " + reqTask.json.end
                    + " " + moment.unix(reqTask.json.end).utc().format("DD-MMM h:mm:ss a"));
            }

            //cache the merge key
            mergeCache.addKey(cacheId, results[ind].key);

            //attach a signature to the request
            reqTask.cache = {
                "cacheId": cacheId,
                "mergeKey": results[ind].key
            };
            //log.info(JSON.stringify(reqTask, null, 4));
            secondaryTasks.push(reqTask);
        }
    }
    return secondaryTasks;
};

exports._getDefaultTaskObj = _getDefaultTaskObj;
exports.buildFromConfig = buildFromConfig;
exports.buildFromResponse = buildFromResponse;
