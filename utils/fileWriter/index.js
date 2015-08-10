"use strict";

var Promise = require("bluebird")
    , fs = require("fs")
    , config = require("config")
    ;

var format = config.get("app.format").toLowerCase() || "json"
    , writeConfig = config.get("app.write_to_file") || "false"
    , log = require('../logger')
    ;

var supportedFormats = ["json","csv"]
    ;


/**
 * write
 * 
 * @param fileName - string
 * @param content - string
 * @returns {bluebird promise}
 */
var write = function write(fileName, content) {
    return new Promise(function(resolve, reject){

        if(supportedFormats.indexOf(format) === -1){
            log.warn("Invalid config: app.format. Defaulting to json");
            format = "json";
        }
        if(writeConfig === "false"){
            return resolve();
        }
        fs.writeFile("./output/" + process.env.NODE_ENV + "-" + fileName
            + "." + format, content + "\n", function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

exports.write = write;