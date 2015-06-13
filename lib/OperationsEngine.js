//TODO - refactor this class to use promises

'use strict';
var async = require("async")
    , log = require("../utils/logger")
    , request = require("request")
    , config = require("config")
    , taskManager = require('./taskManager')
    , mergeCache = require('./mergeCache')
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
 * process - process primary and secondary tasks
 *
 * @param tasks
 * @param cb
 */
OperationsEngine.fn.process = function (tasks, cb) {
    var self = this;
    this.enqueue(tasks, function (err, data, task) {
        if(err){
            cb(err);
        }
        cb(null, data, task);

        //secondary tasks
        if(task.then && Object.keys(task.then).length !== 0) {

            var secondaryTasks = taskManager.buildFromResponse(data, task.then);

            self.enqueue(secondaryTasks, function (sErr, sData, sTask) {
                if(err){
                    cb(sErr);
                }

                //Get the cache id from the task
                var cacheId = sTask.cache.cacheId;

                //decrement the job count
                mergeCache.decrement(cacheId);

                //add the new results data in the cache
                mergeCache.add(cacheId,
                    sTask.cache.mergeKey, sData.analysis.results);

                //load the final results
                var cacheObj = mergeCache.get(cacheId);

                //last taks, callback
                if(cacheObj.taskCount === 0){
                    delete (cacheObj.taskCount);
                    cb(null, cacheObj, sTask);
                }
            });
        }
    });
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
        //callback with the task and results
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
    log.info("Making request...");
    request(task, function (err, response, body) {
        if (err) {
            cb(err);
        }
        cb(null, body, task);
    });
};

module.exports = OperationsEngine;
