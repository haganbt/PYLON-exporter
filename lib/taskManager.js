'use strict';

var log = require('../utils/logger')
    , config = require('config')
    , request = require('request')
    , moment = require('moment')
    , dataProcessor = require('./dataProcessor')
    ;

require('request-debug')(request);

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

/**
 * load - load each config object and return request function
 * for each.
 *
 * @return obj
 *
 */
var load = function load() {

    var jobs = {};
    var tasks = config.get('analysis.fd');

    for (var prop in tasks) {
        if (tasks.hasOwnProperty(prop)) {
            log.info(tasks[prop]);
            jobs[tasks[prop].target] = function(next){

                options.json.parameters.parameters = {
                    'target': tasks[prop].target,
                    'threshold': tasks[prop].threshold
                }

                request(options, function (err, response, body) {
                    if (err) next(err);

                    //process each response
                    dataProcessor.process(body, function (err) {
                        if (err) next(err);
                        next(null, body);
                    })
                });

            };
        }
    }
    return jobs;
};
exports.load = load;