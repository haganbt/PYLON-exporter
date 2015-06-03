"use strict";

var log = require('../logger')
    ;

var config = require('config')
    ;

var load = function load() {
    try{
        var tasks = config.get('analysis');
        return tasks;
    } catch(e){
        log.error("No analysis defined within config. Exiting.");
        process.exit(0);
    }
};

exports.load = load;
