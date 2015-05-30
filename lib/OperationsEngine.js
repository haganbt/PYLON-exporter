'use strict';

var async = require("async")
    , log = require("../utils/logger")
    , config = require("config")
    , request = require("request")
    , moment = require("moment")
    ;

var concurrency = Number(process.env.MAX_PARALLEL_SENDS || 2)
    ;

//require("request-debug")(request);

function numberOfKeys(o) {
    return o !== undefined && Object.keys(o).length;
}

/**
 * @constructor
 */
function OperationsEngine() {
    log.info("New OperationsEngine created.");
    this.queue = async.queue(this.makeRequest, concurrency);
}

/**
 * @type {Object|Function|OperationsEngine}
 */
OperationsEngine.fn = OperationsEngine.prototype;

/**
 * enqueue - add task to queue
 *
 * @param task - object or array of objects
 * @param cb
 */
OperationsEngine.fn.enqueue = function (task, cb) {
    this.queue.push(task, function (err, data) {
        if(err){
            cb(err)
        }
        cb(null, data);
    });
};

/**
 * makeRequest
 *
 * @param task
 * @param cb
 */
OperationsEngine.fn.makeRequest = function (task, cb) {

    log.info("Making request for task: " + JSON.stringify(task));
    request(task, function (err, response, body) {
        if (err) {
            cb(err);
        }
        cb(null, body);
    });
};

module.exports = OperationsEngine;
