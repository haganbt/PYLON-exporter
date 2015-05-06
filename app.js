'use strict';

var bunyan = require('bunyan')
    , log = require('./utils/logger')
    , config = require('config')
    ;

log.info('Hello from logger with config: ' + config.get('auth.username'));