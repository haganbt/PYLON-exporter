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
        "parameters": {
            "parameters": {}
        }
    }
};

/**
 * getRequestFunction - for a given parameter object, return a
 * request funtion setting parameters
 *
 * @param options - request parameters
 * @returns {Function}
 */
var _getRequestFunction = function _getRequestFunction(options) {

    return function (next) {
        request(options, function (err, response, body) {
            if (err) {
                next(err);
            }
            //process each response
            responseHandler.eachItem(body, options.then || {}, function () {
                if (err) {
                    next(err);
                }
                next(null, body);
            });
        });
    };
};

/**
 * buildTasks - builds an array of request functions
 * along with their options
 *
 * @param ops - array request task properties
 * @returns array - of request functions
 */
var buildRequestFunctions = function buildRequestFunctions(ops) {

    var reqFunctions = [];

    for (var prop in ops) {
        if (ops.hasOwnProperty(prop)) {
            reqFunctions.push(_getRequestFunction(ops[prop]));
        }
    }
    return reqFunctions;
};

/**
 * buildFromConfig - iterate config file building
 * an "options" object for each task.
 *
 * @returns {Array}
 */
var loadConfig = function loadConfig() {

    //todo - load from config or overwrite from function params


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

                    log.info("Building request options (" + analysisType + "): ");

                    for (var paramKey in tasks[analysisType][taskKey]) {

                        //copy the "then" object to params
                        if (paramKey === "then") {
                            eachOptions.then = tasks[analysisType][taskKey].then;
                        } else {
                            eachOptions.json.parameters.parameters[paramKey] = tasks[analysisType][taskKey][paramKey];
                        }

                    }
                    log.debug("Options generated: " + JSON.stringify(eachOptions));

                    allTasks.push(eachOptions);
                }
            }

        }
    }
    return allTasks;
};

exports.buildRequestFunctions = buildRequestFunctions;
exports.loadConfig = loadConfig;

exports._getRequestFunction = _getRequestFunction;
