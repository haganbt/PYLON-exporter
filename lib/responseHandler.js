"use strict";

var log = require("../utils/logger")
    ;

/**
 * eachItem - Process individual responses
 *
 * @param inData - obj
 * @param cb - obj - err
 */
var eachItem = function process(inData, cb) {

    log.debug("Response:");
    log.debug("   " + JSON.stringify(inData));

    writeToFile(JSON.stringify(inData));

    //cb(new Error("Foo"));
    cb(null);
};


/**
 * quick and dirty write to file
 */
var fs = require('fs');
var writeToFile = function writeToFile(content) {

    var env = process.env.NODE_ENV;

    if(env === undefined){
        env = "default";
    }

    fs.appendFile("./output/" + env + ".txt", "\n"+content, function(err) {
        if(err) {
            log.debug(err);
        }
    });

}




exports.eachItem = eachItem;
