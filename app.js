'use strict';

var log = require('./utils/logger')
    , taskManager = require('./lib/taskManager')
    , OperationsEngine = require('./lib/OperationsEngine')
    , fs = require('fs');
    ;

var outputFileName = "output.txt";
var dataCSV;
var oe = new OperationsEngine();
var configTasks = taskManager.buildFromConfig();

oe.process(configTasks, function(err, data, task){
    if(err){
        log.error(err);
    } else {
        console.log("\n");
        log.info("REQUEST ::: " + JSON.stringify(task.json));
        log.info("RESPONSE ::: " + JSON.stringify(data));
        dataCSV = "\nQuery:\n"+JSON.stringify(task.json)+"\nResults: \n"+jsonToCsv(data);
        writeData(dataCSV);

    }
});

function jsonToCsv(data) {
    var csv = '';
    if (typeof (data) !== 'object' || !data.analysis.results) return;

    for (var i = 0; i < data.analysis.results.length; i++) {
        csv +=data.analysis.results[i].key + ',' + 
            data.analysis.results[i].unique_authors + "\n";
    }
    return csv;
}

function writeData(analysisData){
  fs.appendFile(outputFileName, analysisData, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("Result saved!");
});  
}
