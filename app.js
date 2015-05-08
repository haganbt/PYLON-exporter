'use strict';

var log = require('./utils/logger')
    , config = require('config')
    , async = require('async')
    , request = require('request')
    ;

var options = {
    'auth': {
        'user': config.get('auth.username'),
        'pass': config.get('auth.api_key')
    },
    'uri': 'https://api.datasift.com/v1/pylon/get?hash='+config.get('hash'),
    resolveWithFullResponse: true
};


var tasks = config.get('analysis.frequencyDistribution');
var jobs = {};

for (var prop in tasks) {
    if (tasks.hasOwnProperty(prop)) {
        //log.info(tasks[prop]);
        jobs[tasks[prop].target] = function(next){
            request(options, function (err, response, body) {
                if (err) next(err);
                log.info(body);
                next(null, body);
            });
        };
    }
}

console.log(jobs);



async.parallelLimit(jobs, 3
, function(err, results) {
    if(err){
        log.error(err);
    }

    log.info(results);
    log.info("Complete.");
});