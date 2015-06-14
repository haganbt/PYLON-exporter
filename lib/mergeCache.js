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
     *
     * @param id
     * @returns {*}
     */
    get: function get(id) {
        return data[id];
    },

    /**
     * getAll - test helper
     * @returns {{}}
     */
    getAll: function getAll() {
        return data;
    },

    /**
     * add - add a key or the data for a key to the cache
     *
     * @param id - string - cache id
     * @param key - string
     *            - the parent key for the data to be cached
     * @param cacheData (optional) - obj - the data to be cached
     * @returns {*}
     */
    add: function add(id, key, cacheData) {

        //check key exists before value is added
        if((data[id].hasOwnProperty(key) === false)
                        && (cacheData !== undefined)){
            log.error("Invalid cache key");
            return data[id];
        }

        /**
         * if a key is added, this task must
         * be completed at some point and hence
         * increment the remainingTasks count
         * otherwise, data has been added from
         * a successful response so decrement
         * remainingTasks
         */
        if(cacheData === undefined){
            //increment count of expected responses
            data[id].remainingTasks ++;
        } else {
            //decrement count of expected responses
            data[id].remainingTasks --;
        }

        data[id][key] = cacheData || {};
        return data[id];
    }
};
