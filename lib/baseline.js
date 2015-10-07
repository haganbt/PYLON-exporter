'use strict';

var config = require('config')
    , _ = require('lodash')
    ;

/**
 * getBaselineTask - clones an modifies the task
 * to generate an associated baseline task
 *
 * @param {task}
 * @returns {*}
 */
var getBaselineTask = function getBaselineTask(task) {
    var bsTask = _.cloneDeep(task);
    bsTask.name = bsTask.name + "_BASELINE";
    bsTask.cache.mergeKey = task.cache.mergeKey + "_BASELINE";

    // Add a signature to identify baseline task
    bsTask.baseline = true;

    return bsTask;
};

exports.getBaselineTask = getBaselineTask;
