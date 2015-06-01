'use strict';

var log = require('./utils/logger')
    , taskManager = require('./lib/taskManager')
    , OperationsEngine = require('./lib/OperationsEngine')
    ;

var oe = new OperationsEngine();
var configTasks = taskManager.buildFromConfig();


//TODO - seperation 1) load from config, 2) handle response to call enqueue once again


oe.enqueue(configTasks, function(err, data, task){
    if(err){
        log.error(err);
    }

    log.info("::: result (primary): " + JSON.stringify(data));
    log.info("::: result (primary) task : " + JSON.stringify(task));


    if(task.then && Object.keys(task.then).length !== 0) {

        var secondaryTasks = taskManager.buildFromResponse(data, task.then);

        //queue secondary requests
        oe.enqueue(secondaryTasks, function(sErr, sData, sTask) {
            if (sErr) {
                log.error(sErr);
            }
            log.info("::: result (secondary): " + JSON.stringify(sData));
            log.info("   ---- : " + JSON.stringify(sTask.json.parameters.analysis_type));
            log.info("   ---- : " + JSON.stringify(sTask.json.parameters.parameters.target));
            log.info("   ---- : " + JSON.stringify(sTask.json.filter));
        });
    }
});
