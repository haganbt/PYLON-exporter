'use strict';

var log = require('./utils/logger')
    , taskManager = require('./lib/taskManager')
    , OperationsEngine = require('./lib/OperationsEngine')
    ;

var oe = new OperationsEngine();
var configTasks = taskManager.buildFromConfig();

oe.enqueue(configTasks, function(err, data, then){
    if(err){
        log.error(err);
    }

    log.info("::: result (primary): " + JSON.stringify(data));


    if(then && Object.keys(then).length !== 0) {

        var secondaryTasks = taskManager.buildFromResponse(data, then);

        //queue secondary requests
        oe.enqueue(secondaryTasks, function(sErr, sData) {
            if (sErr) {
                log.error(sErr);
            }
            log.info("::: result (secondary): " + JSON.stringify(sData));
        });
    }
});
