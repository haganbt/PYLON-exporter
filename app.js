'use strict';

var DataSift = require('./lib/datasift/datasift')
    , log = require('./utils/logger')
    , config = require('config')
    , ds = new DataSift(config.get('auth.username'), config.get('auth.api_key'))
    ;

log.info('Hello from logger with DS: ' + typeof(ds));