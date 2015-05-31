"use strict";

var defaultOperator = "==";

var operatorTargets = {
    "fb.content": "any",
    "fb.parent.content": "any",
    "interaction.content": "any",
    "interaction.raw_content": "any"
};

/**
 * get - lookup the set operator for a given target
 *
 * @param target - string
 * @returns string
 */
var get = function get(target) {
    if (operatorTargets.hasOwnProperty(target)) {
        return operatorTargets[target];
    }
    return defaultOperator;
};

exports.get = get;
