'use strict';

var uuid = require('node-uuid')
    ;

var data = {}
    ;

module.exports = {

    create: function set() {
        var id = uuid.v1();
        data[id] = { "taskCount": 0 };
        return id;
    },

    get: function get(id) {
        return data[id];
    },

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

        // is data being added?
        if(cacheData === undefined){
            //decrement count of expected responses
            data[id].taskCount --;
        } else {
            //increment count of expected responses
            data[id].taskCount ++;
        }

        data[id][key] = cacheData || {};
        return data[id];
    }
};
