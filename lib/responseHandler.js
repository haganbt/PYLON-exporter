"use strict";

var log = require("../utils/logger")
    ;

/**
 * eachItem - Process individual responses
 *
 * @param inData - obj
 * @param cb - obj - err
 */
var eachItem = function process(inData, cb) {

    log.debug("Response:");
    log.debug("   " + JSON.stringify(inData));

    //cb(new Error("Foo"));
    cb(null);
};

exports.eachItem = eachItem;