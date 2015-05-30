'use strict';

var async = require("async")
    , log = require("../utils/logger")
    , request = require("request")
    , responseHandler = require('./responseHandler')
    ;

var concurrency = Number(process.env.MAX_PARALLEL_SENDS || 2)
    ;

//require("request-debug")(request);

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

    var then = task.then || {};

    request(task, function (err, response, body) {
        if (err) {
            cb(err);
        }
        responseHandler.process(body, then, cb);
    });
};

module.exports = OperationsEngine;
