"use strict";

var log = require('../logger')
    ;

var config = require('config')
    ;

/**
 * Load and validate config file
 *
 * @returns obj
 */
var load = function load() {
    try{
        var configObj = config.get('analysis');

        //todo validation

        return configObj;
    } catch(e){
        log.error(new Error("Unable to process config file. Exiting."));
        process.exit(0);
    }
};

exports.load = load;
