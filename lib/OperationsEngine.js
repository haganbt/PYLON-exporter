'use strict';

var async = require("async")
    , log = require("../utils/logger")
    , config = require("config")
    , request = require("request")
    , moment = require("moment")
    ;

var concurrency = Number(process.env.MAX_PARALLEL_SENDS || 5)
    ;

require("request-debug")(request);

function numberOfKeys(o) {
    return o !== undefined && Object.keys(o).length;
}


/**
 * @constructor
 */
function OperationsEngine() {

    log.info("New OperationsEngine created.");

    this.queue = async.queue(this.makeRequest, concurrency);
    this.defaults = {
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
}


/**
 * @type {Object|Function|OperationsEngine}
 */
OperationsEngine.fn = OperationsEngine.prototype;


/**
 * makeRequest
 *
 * @param task
 * @param cb
 */
OperationsEngine.fn.makeRequest = function (task, cb) {

    log.info("Making request for task: " + JSON.stringify(task));

    request(defaults, function (err, response, body) {
        if (err) {
            cb(err);
        }

        cb(null, body);

    });
};

module.exports = OperationsEngine;
