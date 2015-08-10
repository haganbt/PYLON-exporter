'use strict';

if(process.env.NODE_ENV === undefined){
    process.env.NODE_ENV = "test";
}

var log = require('./utils/logger')
    , taskManager = require('./lib/taskManager')
    , OperationsEngine = require('./lib/OperationsEngine')
    , converter = require("./utils/jsonToCsv")
    , fw = require("./utils/fileWriter")
    ;

log.info("Using config file: " + process.env.NODE_ENV);

var oe = new OperationsEngine();
var configTasks = taskManager.buildFromConfig();

oe.process(configTasks, function(err, data, task){
    if(err){
        log.error(err);
    } else {
        //log.info("REQUEST ::: " + JSON.stringify(task.json));

        log.info("NAME: " + JSON.stringify(task.name));
        //log.info(JSON.stringify(data, null, 4));

/*
        fw.appendFile(task.name, JSON.stringify(data, null, 4))
        .catch(function (err) {
            log.error(err);
        });
*/
        converter.jsonToCsv(data)
        .then(function (csvData){
            log.info(csvData)
        })
        .catch(function (err) {
            log.error(err);
        });


    }
});

