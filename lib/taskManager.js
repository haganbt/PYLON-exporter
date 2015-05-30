'use strict';

var log = require('../utils/logger')
    , config = require('config')
    , moment = require('moment')
    , _ = require('lodash')
    , responseHandler = require('./responseHandler')
    ;

//require('request-debug')(request);

var defaults = {
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
            'parameters': {}
        }
    }
};

/**
 * buildFromConfig - iterate config file building
 * an 'options' object for each task.
 *
 * @returns {Array}
 */
var loadConfig = function loadConfig() {

    //todo - load from config or overwrite from function params


    var allTasks = [] //request functions
        , tasks = config.get('analysis')
        ;

    for (var analysisType in tasks) {
        if (tasks.hasOwnProperty(analysisType)) {

            for (var taskKey in tasks[analysisType]) {
                if (tasks[analysisType].hasOwnProperty(taskKey)) {

                    var eachOptions = _.cloneDeep(defaults);

                    /*eslint-disable*/
                    eachOptions.json.parameters.analysis_type = analysisType;
                    /*eslint-enable*/

                    log.debug('Building request options (' + analysisType + '): ');

                    for (var paramKey in tasks[analysisType][taskKey]) {

                        //copy the 'then' object to params
                        if (paramKey === 'then') {
                            eachOptions.then = tasks[analysisType][taskKey].then;
                        } else {
                            eachOptions.json.parameters.parameters[paramKey] = tasks[analysisType][taskKey][paramKey];
                        }

                    }
                    log.debug('Options generated: ' + JSON.stringify(eachOptions));

                    allTasks.push(eachOptions);
                }
            }

        }
    }
    return allTasks;
};

exports.loadConfig = loadConfig;
