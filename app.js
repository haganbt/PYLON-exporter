'use strict';

var DataSift = require('./lib/datasift/datasift')
    , log = require('./utils/logger')
    , config = require('config')
    ;

log.info('Hello from logger with config: ' + config.get('auth.username'));