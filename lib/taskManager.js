'use strict';

var log = require('../utils/logger')
    , config = require('config')
    , moment = require('moment')
    , _ = require('lodash')
    , responseHandler = require('./responseHandler')
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

exports.getDefaultTaskObj = getDefaultTaskObj;
exports.buildFromConfig = buildFromConfig;
