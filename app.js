'use strict';

if(process.env.NODE_ENV === undefined){
    process.env.NODE_ENV = "test";
}

var fs = require('fs');

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
        //log.info("REQUEST ::: " + JSON.stringify(task.json));

        log.info(JSON.stringify(task.name));
        log.info(JSON.stringify(data, null, 4));

        appendFile("\n\nName: " + task.name + "\n-------------------------------");
        appendFile(JSON.stringify(data) + "\n");

        if (Array.isArray(data)) {
            appendFile("key,interactions,unique_authors");
            data.forEach(
                function(childObj) {
                    appendFile(childObj.key  + "," +
                        childObj.interactions  + "," + childObj.unique_authors);
                });
        } else {
            appendFile("name,key,interactions,unique_authors");
            Object.keys(data).reduce(
                function(previousValue, currentValue) {
                    data[currentValue].forEach(
                        function(childObj) {
                            appendFile(currentValue +  "," + childObj.key  + "," +
                                childObj.interactions  + "," + childObj.unique_authors);
                        });
                },{}
            );
        }
    }
});


function appendFile(content, filename){
    if(filename === undefined){
        filename = "out";
    }

    fs.appendFile("./output/" + filename + ".txt", "\n" + content, function (err) {
        if (err) throw err;
    });
}


