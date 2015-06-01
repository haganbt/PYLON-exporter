'use strict';

var log = require('../utils/logger')
    , config = require('config')
    , moment = require('moment')
    , _ = require('lodash')
    , operator = require("../utils/operator")
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
var buildFromConfig = function buildFromConfig() {

    var allTasks = []
        , tasks = config.get('analysis')
        ;

    log.info("Building requests from config...");

    for (var analysisType in tasks) {
        if (tasks.hasOwnProperty(analysisType)) {

            for (var taskKey in tasks[analysisType]) {
                if (tasks[analysisType].hasOwnProperty(taskKey)) {

                    var eachOptions = getDefaultTaskObj();

                    /*eslint-disable*/
                    eachOptions.json.parameters.analysis_type = analysisType;
                    /*eslint-enable*/

                    log.debug("TYPE: " + analysisType);

                    for (var paramKey in tasks[analysisType][taskKey]) {
                        //copy the 'then' object to params
                        if (paramKey === 'then') {
                            eachOptions.then =
                                tasks[analysisType][taskKey].then;
                        } else {
                            eachOptions.json.parameters.parameters[paramKey] =
                                tasks[analysisType][taskKey][paramKey];
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

    var secondaryTasks = []
        , results = data.analysis.results || {}
        , resultTarget = data.analysis.parameters.target || "invalid"
        ;

    //process result keys and build the secondary task obj
    for (var ind in results) {
        if (results.hasOwnProperty(ind)) {

            //new req params obj
            var reqParams = getDefaultTaskObj();

            //iterate the then params and push to the new req obj
            for (var thenInd in then) {
                if (then.hasOwnProperty(thenInd)) {
                    reqParams.json.parameters.parameters[thenInd]
                        = then[thenInd];
                }
            }

            reqParams.json.filter = resultTarget + " "
                + operator.get(resultTarget)
                + '"' + results[ind].key + '"';

            secondaryTasks.push(reqParams);
        }
    }
    //log.debug( "secondaryTasks: " + JSON.stringify(secondaryTasks));
    return secondaryTasks;
}

exports.getDefaultTaskObj = getDefaultTaskObj;
exports.buildFromConfig = buildFromConfig;
exports.buildFromResponse = buildFromResponse;
