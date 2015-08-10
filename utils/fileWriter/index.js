"use strict";

var Promise = require("bluebird")
    , fs = require("fs")
    , config = require("config")
    ;

var format = config.get("app.format").toLowerCase() || "json"
    ;

var supportedFormats = ["json,csv"]
    ;


/**
 * appendFile
 * 
 * @param fileName - string
 * @param content - string
 * @returns {bluebird promise}
 */
var appendFile = function appendFile(fileName, content) {
    return new Promise(function(resolve, reject){
        if(supportedFormats.indexOf(format) === '-1'){
            reject(new Error('Invalid file format specified in config.'));
        }
        fs.appendFile("./output/" + process.env.NODE_ENV + "-" + fileName
            + "." + format, content + "\n", function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

exports.appendFile = appendFile;
