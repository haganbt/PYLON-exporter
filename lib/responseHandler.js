"use strict";

var log = require("../utils/logger")
    ;

/**
 * quick and dirty write to file
 */
var fs = require("fs");
var writeToFile = function writeToFile(content) {

    var env = process.env.NODE_ENV;

    if(env === undefined){
        env = "default";
    }

    fs.appendFile("./output/" + env + ".txt", "\n" + content, function(err) {
        if(err) {
            log.debug(err);
        }
    });

};

/**
 * eachItem - Process individual responses
 *
 * @param inData - obj
 * @param cb - obj - err
 */
var eachItem = function eachItem(inData, then, cb) {

    log.debug("Response:");
    log.debug("  -- " + JSON.stringify(inData));


    if(Object.keys(then).length !== 0){

        log.debug("Then obj: " + JSON.stringify(then));
    }


    //writeToFile(JSON.stringify(inData));

    //cb(new Error("Foo"));
    cb(null);
};

exports.eachItem = eachItem;


var buildConfigFromResults