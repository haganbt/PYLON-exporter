//TODO - refactor this class to use promises

'use strict';
var async = require("async")
    , log = require("../utils/logger")
    , request = require("request")
    , config = require("config")
    , taskManager = require('./taskManager')
    , mergeCache = require('./mergeCache')
    , _ = require('lodash')
    ;

var concurrency = Number(process.env.MAX_PARALLEL_TASKS
                || config.get('app.max_parallel_tasks'))
    , outbound = 0
    ;

if(config.has("app.log_level") && (config.get("app.log_level") === "debug")){
    require("request-debug")(request);
}

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
 * process - process primary and secondary tasks
 *
 * @param tasks
 * @param cb
 */
OperationsEngine.fn.process = function (tasks, cb) {
    var self = this;
    this.enqueue(tasks, function (err, data, task) {
        if(err){
            return cb(err);
        }
        if(data.error){
            return cb(data.error);
        }

        //Get the cache id from the task
        if(task && task.cache && task.cache.cacheId){
            self.cache(data, task, cb);

            // Do not return if there is a then obj.
            // This will occur if this is the primary
            // request i.e. the first before processing
            // the then tasks.
        } else if (!task.then){
            //callback with data or redacted
            cb(null, (data.analysis.redacted === false) ?
                data.analysis.results : { "redacted": true }, task);
        }

        //secondary tasks
        if(task.then && Object.keys(task.then).length !== 0) {
            var secondaryTasks = taskManager.buildFromResponse(data, task);
            self.enqueue(secondaryTasks, function (sErr, sData, sTask) {
                if(err){
                    return cb(sErr);
                }
                if(data.error){
                    return cb(sData.error);
                }
                self.cache(sData, sTask, cb);
            });
        }
    });
};

/**
 * cache - adds the data from a response to the cache
 * @param data
 * @param task
 * @param cb
 * @returns {*}
 */
OperationsEngine.fn.cache = function (data, task, cb) {
    //Get the cache id from the task
    var cacheId = task.cache.cacheId;

    //error msg from PYLON?
    if(data.error){
        return cb(data.error, null, task);
    }

    //add the new results data in the cache or redacted
    mergeCache.addData(cacheId,
        task.cache.mergeKey,
        (data.analysis.redacted === false) ?
            data.analysis.results : { "redacted": true });

    var cacheObj = mergeCache.get(cacheId);

    //last task, callback
    if(cacheObj.remainingTasks === 0){
        delete (cacheObj.remainingTasks);
        return cb(null, _.merge(cacheObj, {}), task);
    }
};

/**
 * enqueue - add task obj to queue
 *
 * @param tasks - single object or array of objects i.e.
 *               parameters to make the HTTP request.
 * @param cb - err first cb
 */
OperationsEngine.fn.enqueue = function (tasks, cb) {
    this.queue.push(tasks, function (err, data, task) {
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
    outbound ++;
    if(process.env.NODE_ENV !== 'test'){
        log.info("Making request: " + outbound);
    }
    request(task, function (err, response, body) {
        if (err) {
            cb(err);
        }
        cb(null, body, task);
    });
};

module.exports = OperationsEngine;
