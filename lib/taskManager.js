'use strict';

var log = require('../utils/logger')
    , config = require('config')
    , request = require('request')
    , moment = require('moment')
    , async = require('async')
    , _ = require('underscore')
    //, dataProcessor = require('./dataProcessor')
    ;

//require('request-debug')(request);

var options = {
    'method': 'POST',
    'auth': {
        'user': config.get('auth.username'),
        'pass': config.get('auth.api_key')
    },
    'uri': 'https://api.datasift.com/v1/pylon/analyze',
    'json': {
        'hash': config.get('hash'),
        'start': moment.utc().subtract(1, 'months').unix(),
        'end': moment.utc().unix(),
        'parameters': {
            'analysis_type': 'freqDist'
        }
    }
};


var load = function load() {

    var jobs = [];
    var tasks = config.get('analysis');

    for (var analysisType in tasks) {
        if (tasks.hasOwnProperty(analysisType)) {

            console.log("");
            console.log("********* "+analysisType);

            for (var key in tasks[analysisType]) {
                if (tasks[analysisType].hasOwnProperty(key)) {

                    var eachOptions = _.clone(options);

                    eachOptions.json.parameters.parameters = {
                        'target': tasks[analysisType][key].target,
                        'threshold': tasks[analysisType][key].threshold
                    };

                    console.log("  -- Target: "+tasks[analysisType][key].target);
                    console.log("  -- Threshold: "+tasks[analysisType][key].threshold);

                    var t = build(eachOptions);

                    jobs.push(t);

                    console.log("  - "+key + "  - "+JSON.stringify(tasks[analysisType][key]));
                    console.log("--------------------------------------------------");
                    console.log("");
                    console.log("");


                }
            }




        }
    }


    async.parallel(jobs
        , function (err, results) {
            if (err) {
                log.info(err);
            }

            log.info(results);
            log.info("Complete.");
        });

};


var build = function build(ops){

console.log("Final options: "+JSON.stringify(ops));
    return function(next){

        request(ops, function (err, response, body) {
            if (err) next(err);
            //process each response
            //dataProcessor.process(body, function (err) {
            //  if (err) next(err);
            next(null, body);
            //})
        });

    };

}
exports.build = build;
exports.load = load;