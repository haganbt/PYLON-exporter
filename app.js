'use strict';

var log = require('./utils/logger')
    , taskManager = require('./lib/taskManager')
    , OperationsEngine = require('./lib/OperationsEngine')
    , json2csv = require('json2csv')
    ;

var oe = new OperationsEngine();
var configTasks = taskManager.buildFromConfig();

oe.process(configTasks, function(err, data, task){
    if(err){


        log.error(err);
    } else {
        console.log("\n");
        //log.info("REQUEST ::: " + JSON.stringify(task.json));
        //log.info("RESPONSE ::: " + JSON.stringify(data));

        var fields = ['key', 'interactions', 'unique_authors'];

        if(data.analysis.results){
            json2csv({ data: data.analysis.results, fields: fields },
                function(csVErr, csv) {
                    if (csVErr) { console.log(csVErr); }

                    //log.info(csv);
            });
        }
    }
});
