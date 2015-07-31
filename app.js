'use strict';

if(process.env.NODE_ENV === undefined){
    process.env.NODE_ENV = "test";
}

var log = require('./utils/logger')
    , taskManager = require('./lib/taskManager')
    , OperationsEngine = require('./lib/OperationsEngine')
    ;

log.info("Using config file: " + process.env.NODE_ENV);

var oe = new OperationsEngine();
var configTasks = taskManager.buildFromConfig();

oe.process(configTasks, function(err, data, task){
    if(err){
        log.error(err);
    } else {
        console.log("\n");
        log.info("REQUEST ::: " + JSON.stringify(task.json));
        log.info("RESPONSE ::: " + JSON.stringify(data));
    }
});
