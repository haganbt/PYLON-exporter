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

    //secondaryTasks
    if(Object.keys(then).length !== 0){
        log.debug("Then obj: " + JSON.stringify(then));

        var secondaryTasks = []
            , results = data.analysis.results || {}
            , resultTarget = data.analysis.parameters.target || ""
            ;

        log.debug("Results array: " + JSON.stringify(results));

        //process result keys and build the secondary task obj
        for (var ind in results) {
            if (results.hasOwnProperty(ind)) {

                //new req params obj
                var reqParams = taskManager.getDefaultTaskObj();

                //reqParams.parameters.parameters.target = then.target;

                //iterate the then params and push to the new req obj
                for (var thenInd in then) {
                    if (then.hasOwnProperty(thenInd)) {
                        reqParams.json.parameters.parameters[thenInd]
                            = then[thenInd];
                    }
                }

                //filter - TODO hashmap for operator lookup
                reqParams.json.filter = resultTarget
                        + ' == "' + results[ind].key + '"';

                //log.debug( "Generated secondary params: "
                //      + JSON.stringify(reqParams));

                secondaryTasks.push(reqParams);
            }
        }
        //log.debug( "secondaryTasks: " + JSON.stringify(secondaryTasks));

        //make secondary requests
        oe.enqueue(secondaryTasks, function(sErr, sData) {
            if (sErr) {
                log.error(sErr);
            }
            log.info("::: result (secondary): " + JSON.stringify(sData));
        });
    }

    log.info("::: result (primary): " + JSON.stringify(data));
});
