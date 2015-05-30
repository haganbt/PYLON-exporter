'use strict';

var log = require('./utils/logger')
    , taskManager = require('./lib/taskManager')
    , OperationsEngine = require('./lib/OperationsEngine')
    ;

var oe = new OperationsEngine();
var configTasks = taskManager.loadConfig();

oe.enqueue(configTasks, function(err, data){
    if(err){
        log.error(err);
    }
    log.info(data);
});
