"use strict";

var log = require('../logger')
    ;

var config = require('config')
    ;

/**
 * jsonToCsv
 *
 * @param inObj - JSON object
 * @param cb - err first cb
 * @returns {string}
 */
var jsonToCsv = function jsonToCsv(inObj, cb) {

    var out = "";

    if(inObj.redacted){
        cb(null, "redacted");
    }

    if (Array.isArray(inObj)) {
        out += "key,interactions,unique_authors\n";
        inObj.forEach(
            function(childObj) {
                out += childObj.key  + "," + childObj.interactions
                    + "," + childObj.unique_authors + "\n";
            });
    } else {
        out += "name,key,interactions,unique_authors\n";
        Object.keys(inObj).reduce(
            function(previousValue, currentValue) {
                if(inObj[currentValue].redacted){
                    out += currentValue  + ",redacted\n";
                } else {
                    inObj[currentValue].forEach(
                        function(childObj) {
                            out += currentValue +  ","
                                + childObj.key  + "," + childObj.interactions
                                + "," + childObj.unique_authors + "\n";
                        });
                }
            },{}
        );
    }
    cb(null, out);
};

exports.jsonToCsv = jsonToCsv;
