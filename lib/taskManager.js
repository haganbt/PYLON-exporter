"use strict";

var log = require("../utils/logger")
    , config = require("config")
    , request = require("request")
    , moment = require("moment")
    , _ = require("lodash")
    , responseHandler = require("./responseHandler")
    ;

//require("request-debug")(request);

var defaults = {
    "method": "POST",
    "auth": {
        "user": config.get("auth.username"),
        "pass": config.get("auth.api_key")
    },
    "uri": "https://api.datasift.com/v1/pylon/analyze",
    "json": {
        "hash": config.get("hash"),
        "start": moment.utc().subtract(1, "months").unix(),
        "end": moment.utc().unix(),
        "parameters": { "parameters": {}
        }
    }
};


/**
 * buildRequestFunction - build a request function
 * using the array of option objects provided
 *
 * @param ops - array of objects - request options
 * @returns {Function}
 */
var buildRequestFunction = function buildRequestFunction(ops){
    return function(next){
        request(ops, function (err, response, body) {

            if (err) {
                next(err);
            }

            //process each response
            responseHandler.eachItem(body, function () {
                if (err) {
                    next(err);
                }
                next(null, body);
            });
        });
    };
};


/**
 * buildFromConfig - iterate config file building
 * an "options" object for each task.
 *
 * @returns {Array}
 */
var buildFromConfig = function buildFromConfig() {

    var allTasks = [] //request functions
        , tasks = config.get("analysis")
        ;

    for (var analysisType in tasks) {
        if (tasks.hasOwnProperty(analysisType)) {

            for (var taskKey in tasks[analysisType]) {
                if (tasks[analysisType].hasOwnProperty(taskKey)) {

                    var eachOptions = _.cloneDeep(defaults);

                    /*eslint-disable*/
                    eachOptions.json.parameters.analysis_type = analysisType;
                    /*eslint-enable*/

                    log.debug("Building request options (" + analysisType + "): ");

                    for (var paramKey in tasks[analysisType][taskKey]) {
                        eachOptions.json.parameters.parameters[paramKey] = tasks[analysisType][taskKey][paramKey];
                    }

                    log.debug(" - parameters: " + JSON.stringify(eachOptions.json.parameters));

                    allTasks.push(eachOptions);
                }
            }

        }
    }
    return allTasks;
};

exports.buildRequestFunction = buildRequestFunction;
exports.buildFromConfig = buildFromConfig;
