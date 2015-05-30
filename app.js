"use strict";

var log = require("./utils/logger")
    , async = require("async")
    , taskManager = require("./lib/taskManager")
    , operationsEngine = require("./lib/OperationsEngine")
    ;

var oe = new operationsEngine();
var configTasks = taskManager.loadConfig();

oe.enqueue(configTasks, function(err, data){
    if(err){
        log.error(err);
    }
    log.info(data);
});
