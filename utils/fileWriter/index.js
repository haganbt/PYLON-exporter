"use strict";

var Promise = require("bluebird")
    , fs = require("fs")
    , config = require("config")
    , moment = require("moment")
    , fse = require('fs-extra')
    , path = require('path')
    , log = require('../logger')
    ;

var format = config.get("app.format").toLowerCase() || "json"
    , writeConfig = config.get("app.write_to_file") || "false"
    ;

var supportedFormats = ["json", "csv"]
    ;

var ts = moment().format("YYYY-MM-DD-HH.mm.ss")
    , dir = "./output/" + process.env.NODE_ENV + "-" + ts
    ;

if(process.env.NODE_ENV.indexOf("tableau") > -1 && writeConfig === true){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    var destFile = dir + '/' + process.env.NODE_ENV + '.twb';
    var absoluteDest = path.resolve(__dirname + '../../../' + dir);

    fse.copy('./lib/tableau/standard-tableau.twb', destFile, function (err) {
        if (err) {
            log.error("Unable to copy Tableau source file.");
        }
        // Tableau cannot save relative paths :(
        // http://community.tableau.com/ideas/4167
        fs.readFile(destFile, 'utf8', function (readErr, data) {
            if (readErr) {
                log.error("Unable to read Tableau source file");
            } else {
                //replace file dir location
                var result = data.replace(/ directory=''/g, " directory='" + absoluteDest + "'");
                //replace workbook name
                var out = result.replace(/standard-tableau/g, process.env.NODE_ENV);
                fs.writeFile(destFile, out, 'utf8', function (writeErr) {
                    if (writeErr) {
                        log.error("Unable to write to Tableau destFile file.");
                    }
                });
            }
        });
    });
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

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        fs.writeFile(dir + "/" + process.env.NODE_ENV + "-"
            + fileName + "." + format, content, "utf8", function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

exports.write = write;
