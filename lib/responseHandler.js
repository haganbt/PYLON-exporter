"use strict";

var log = require("../utils/logger")
    ;


var process = function process(inData, then, cb) {


    if(Object.keys(then).length !== 0){

        log.debug("Then obj: " + JSON.stringify(then));
    }


    //writeToFile(JSON.stringify(inData));

    cb(null, "Success");
};








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








exports.process = process;

