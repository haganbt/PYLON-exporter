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
        //log.info("REQUEST ::: " + JSON.stringify(task.json));
        log.info(JSON.stringify(task.name));
        log.info(JSON.stringify(data, null, 4));

        if (Array.isArray(data)) {
            console.log("key,interactions,unique_authors");
            data.forEach(
                function(childObj) {
                    console.log(childObj.key  + "," +
                        childObj.interactions  + "," + childObj.unique_authors);
                });
        } else {
            console.log("name,key,interactions,unique_authors");
            Object.keys(data).reduce(
                function(previousValue, currentValue) {
                    data[currentValue].forEach(
                        function(childObj) {
                           console.log(currentValue +  "," + childObj.key  + "," +
                               childObj.interactions  + "," + childObj.unique_authors);
                        });
                },{}
            );
        }
    }
});
