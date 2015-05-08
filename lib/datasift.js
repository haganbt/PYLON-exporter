'use strict';

var log = require('../utils/logger')
    , config = require('config')
    , request = require('request')
    ;

var options = {
    'auth': {
        'user': config.get('auth.username'),
        'pass': config.get('auth.api_key')
    },
    'uri': 'https://api.datasift.com/v1/pylon/analyze',
    resolveWithFullResponse: true
};



var getIndexStats = function getIndexStats(cb) {

    options.uri = 'https://api.datasift.com/v1/pylon/get?hash='+
                    config.get('index.hash');



    return request(options, cb);


}

/**
 *
 * @returns {*} promise
 */
var frequencyDistribution = function frequencyDistribution() {
    return(rp(options)
        .catch(function (error) {
            log.error(error)
        }));
}

exports.getIndexStats = getIndexStats;
exports.frequencyDistribution = frequencyDistribution;