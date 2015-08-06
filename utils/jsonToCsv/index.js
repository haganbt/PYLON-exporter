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
    if (Array.isArray(inObj)) {
        out += "key,interactions,unique_authors\n";
        inObj.forEach(
            function(childObj) {
                out += childObj.key  + "," + childObj.interactions
                    + "," + childObj.unique_authors + "\n";
            });
    } else {
        out += "name,key,interactions,unique_authors\n";
        if(inObj.redacted){
            return "redacted";
        }
        Object.keys(inObj).reduce(
            function(previousValue, currentValue) {
                inObj[currentValue].forEach(
                    function(childObj) {
                        out += currentValue +  ","
                            + childObj.key  + "," + childObj.interactions
                            + "," + childObj.unique_authors + "\n";
                    });
            },{}
        );
    }
    cb(null, out);
};

exports.jsonToCsv = jsonToCsv;
