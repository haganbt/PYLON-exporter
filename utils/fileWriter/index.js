"use strict";

var Promise = require("bluebird")
    , fs = require("fs")
    , config = require("config")
    , moment = require("moment")
    , fse = require('fs-extra')
    ;

var format = config.get("app.format").toLowerCase() || "json"
    , writeConfig = config.get("app.write_to_file") || "false"
    , log = require('../logger')
    ;

var supportedFormats = ["json","csv"]
    ;

var ts = moment().format("YYYY-MM-DD-HH.mm.ss")
    ;

if(process.env.NODE_ENV.indexOf("tableau") > -1){
    var dir = '/standard-tableau';
    if (!fs.existsSync(dir)){
        try {
            fs.mkdirSync(dir);
            fse.emptyDirSync(dir);
        } catch(e){
            log.error(new Error("/standard-tableau directory does not exist."));
            process.exit(0);
        }
    } else {
        fse.emptyDirSync(dir);
    }
}

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
        var dir = "./output/" + process.env.NODE_ENV + "-" + ts;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        _writeFileSync(dir, fileName, format, content, reject);

        if(process.env.NODE_ENV.indexOf("tableau") > -1){
            _writeFileSync('/standard-tableau', fileName, format, content, reject);
        }
        resolve();
    });
};

/**
 * _writeFileSync - write file to disk
 *
 * @param dir
 * @param fileName
 * @param format
 * @param content
 * @param reject
 * @private
 */
var _writeFileSync = function _writeFileSync(dir, fileName, format, content, reject){
    fs.writeFile(dir + "/" + process.env.NODE_ENV + "-"
        + fileName + "." + format, content, "utf8", function (err) {
        if (err) {
            reject(err);
        }
    });
};

exports.write = write;
