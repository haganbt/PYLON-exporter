"use strict";

//TODO - delete this - its temp!

var log = require("../utils/logger")
    ;

/**
 * quick and dirty write to file
 *
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

exports.writeToFile = writeToFile;

