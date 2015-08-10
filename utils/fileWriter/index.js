"use strict";

var Promise = require("bluebird")
    , fs = require("fs")
    , config = require("config")
    , moment = require("moment")
    ;

var format = config.get("app.format").toLowerCase() || "json"
    , writeConfig = config.get("app.write_to_file") || "false"
    , log = require('../logger')
    ;

var supportedFormats = ["json","csv"]
    ;

var ts = moment().format("YYYY-MM-DD-HH.mm.ss");
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
        // pretty print json
        if(format === "json"){
            content = JSON.stringify(content, null, 4);
        }

        // create dir
        var dir = "./output/" + process.env.NODE_ENV + "-" + ts;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }


        fs.writeFile(dir + "/" + process.env.NODE_ENV + "-" + fileName + "." + format, content, "utf8", function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

exports.write = write;
