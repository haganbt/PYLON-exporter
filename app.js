"use strict";

var log = require("./utils/logger")
    , async = require("async")
    , taskManager = require("./lib/taskManager")
    ;

var tasks = taskManager.buildFromConfig();
var jobs = [];

//iterate tasks and build requestFunctions for each
//TODO - move the iteration of array to buildRequestFunction()
for (var prop in tasks) {
    if (tasks.hasOwnProperty(prop)) {
        jobs.push(taskManager.buildRequestFunction(tasks[prop]));
    }
}


/**
 * Run the tasks array of functions in parallel, without waiting until
 * the previous function has completed. If any of the functions pass
 * an error to its callback, the main callback is immediately called
 * with the value of the error. Once the tasks have completed, the
 * results are passed to the final callback as an array.
 */
async.parallelLimit(jobs, 2
    , function (err) { // , function (err, results) {
        if (err) {
            log.info(err);
        }

        log.info("All requests complete.");
    });
