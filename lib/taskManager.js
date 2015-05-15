'use strict';

var log = require('../utils/logger')
    , config = require('config')
    , request = require('request')
    , moment = require('moment')
    , _ = require('lodash')
    , responseHandler = require('./responseHandler')
    ;

//require('request-debug')(request);

//default request paramaters
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
        'parameters': { "parameters" :{}
        }
    }
};


/**
 * buildResponseFunction
 *
 * @param ops - object - request options
 * @returns {Function}
 */
var buildResponseFunction = function buildResponseFunction(ops){
    return function(next){
        request(ops, function (err, response, body) {

            if (err) next(err);

            //process each response
            responseHandler.eachItem(body, function () {
                if (err) next(err);
                next(null, body);
            });

        });
    };
};


/**
 * load - and iterate config file building custom
 * options. Build a request function and finally return
 * an array of functions.
 *
 * @returns {Array}
 */
var load = function load() {

    var jobs = [] //request functions
        , tasks = config.get('analysis')
        ;

    for (var analysisType in tasks) {
        if (tasks.hasOwnProperty(analysisType)) {

            for (var taskKey in tasks[analysisType]) {
                if (tasks[analysisType].hasOwnProperty(taskKey)) {

                    var eachOptions = _.cloneDeep(defaults);

                    eachOptions.json.parameters.analysis_type = analysisType;

                    log.debug("Building request options (" + analysisType + "): ");

                    for (var paramKey in tasks[analysisType][taskKey]) {
                        eachOptions.json.parameters.parameters[paramKey] = tasks[analysisType][taskKey][paramKey];
                    }

                    log.debug("  - parameters: "+JSON.stringify(eachOptions.json.parameters));

                    var t = buildResponseFunction(eachOptions);
                    jobs.push(t);
                }
            }

        }
    }
    return jobs;
};

exports.buildResponseFunction = buildResponseFunction;
exports.load = load;