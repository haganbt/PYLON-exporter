"use strict";

var log = require("./utils/logger")
    , async = require("async")
    , taskManager = require("./lib/taskManager")
    , operationsEngine = require("./lib/OperationsEngine")
    ;


var oe = new operationsEngine();


oe.queue.push({name: 'foo'}, function (err) {

    if(err){
        log.error(err);
    }


    log.info('finished processing');
});


/*
var tasks = taskManager.loadConfig();
var taskFunctions = taskManager.buildRequestFunctions(tasks);
*/

/**
 * Run the tasks array of functions in parallel, without waiting until
 * the previous function has completed. If any of the functions pass
 * an error to its callback, the main callback is immediately called
 * with the value of the error. Once the tasks have completed, the
 * results are passed to the final callback as an array.

async.parallelLimit(taskFunctions, 5
    , function (err, results) {
        if (err) {
            log.info(err);
        }

        log.info("All requests complete:");
        log.info("    " + JSON.stringify(results));
    });
 */