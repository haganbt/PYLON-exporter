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

        var csv = jsonToCsv(data);
        log.info(csv);


        appendFile("NAME: " + task.name + "\n\n", 'all', 'txt');
        appendFile(JSON.stringify(data, null, 4) + "\n\n", 'all', 'txt');
        appendFile(csv + "\n\n", 'all', 'txt');
        appendFile("---------------------------------------\n\n", 'all', 'txt');
        appendFile(csv, task.name);

    }
});

function jsonToCsv(inData){
    var out = "";
    if (Array.isArray(inData)) {
        out += "key,interactions,unique_authors\n";
        inData.forEach(
            function(childObj) {
                out += childObj.key  + "," + childObj.interactions
                    + "," + childObj.unique_authors + "\n";
            });
    } else {
        out += "name,key,interactions,unique_authors\n";
        if(inData.redacted){
            return "redacted";
        }
        Object.keys(inData).reduce(
            function(previousValue, currentValue) {
                inData[currentValue].forEach(
                    function(childObj) {
                        out += currentValue +  ","
                            + childObj.key  + "," + childObj.interactions
                            + "," + childObj.unique_authors + "\n";
                    });
            },{}
        );
    }
    return out;
}

function appendFile(content, filename, suffix){
    if(filename === undefined){
        filename = "out";
    }

    if(suffix === undefined){
        suffix = "csv";
    }

    fs.appendFile("./output/" + process.env.NODE_ENV
        + "-" + filename + "." + suffix, content, function (err) {
        if (err) throw err;
    });
}
