'use strict';

var uuid = require('node-uuid')
    ;

var log = require("../utils/logger")
    ;

var data = {}
    ;

module.exports = {

    /**
     * create - new cache object
     * @returns {*}
     */
    create: function set() {
        var id = uuid.v1();
        data[id] = { "remainingTasks": 0 };
        return id;
    },

    /**
     * get - by cache id
     * @param id
     * @returns {*}
     */
    get: function get(id) {
        return data[id];
    },

    /**
     * addKey - to cache
     * @param id
     * @param key
     * @returns {Error}
     */
    addKey: function addKey(id, key) {
        //create the key unless already created
        if(data[id].hasOwnProperty(key)){
            return new Error("Duplicate key error.");
        } else {
            data[id][key] = {};
        }
        //increment count of expected responses
        data[id].remainingTasks ++;
        return;
    },

    /**
     * add - add a key or the data for a key to the cache
     *
     * @param id  - string - cache id
     * @param key - string - the key to be used to store the
     *              data for each response payload.
     * @param cacheData - obj - the data to be cached
     * @returns {*} - obj - cache object
     */
    addData: function addData(id, key, cacheData) {
        //decrement count of expected responses
        data[id].remainingTasks --;
        data[id][key] = cacheData || [];
        return data[id];
    }
};
