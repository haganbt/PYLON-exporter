'use strict';

var async = require("async")
    , log = require("../utils/logger")
    , request = require("request")
    , config = require("config")
    , responseHandler = require('./responseHandler')
    ;

var concurrency = Number(process.env.MAX_PARALLEL_TASKS
                || config.get('app.max_parallel_tasks'))
    ;

//require("request-debug")(request);

/**
 * @constructor
 */
function OperationsEngine() {
    log.info("New OperationsEngine created with concurrency: " + concurrency);
    this.queue = async.queue(this.makeRequest, concurrency);
}

/**
 * @type {Object|Function|OperationsEngine}
 */
OperationsEngine.fn = OperationsEngine.prototype;

/**
 * enqueue - add task obj to queue
 *
 * @param task - single object or array of objects i.e.
 *               parameters to make the HTTP request.
 * @param cb
 */
OperationsEngine.fn.enqueue = function (task, cb) {
    this.queue.push(task, function (err, data, task) {
        if(err){
            cb(err);
        }
        cb(null, data, task);
    });
};

/**
 * makeRequest - execute HTTP request
 *
 * @param task
 * @param cb
 */
OperationsEngine.fn.makeRequest = function (task, cb) {

    log.info("Making request with options... \n    "
                + JSON.stringify(task));

    request(task, function (err, response, body) {
        if (err) {
            cb(err);
        }
        cb(null, body, task);
    });
};

module.exports = OperationsEngine;
