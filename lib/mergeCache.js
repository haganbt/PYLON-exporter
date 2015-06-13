'use strict';
var data = {}
    ;

module.exports = {

    set: function set(id) {
        data[id] = { "taskCount": 0 };
        return data[id];
    },

    get: function get(id) {
        return data[id];
    },

    getAll: function getAll() {
        return data;
    },

    add: function add(id, key, value) {
        data[id][key] = value || {};
        return data[id];
    },

    increment: function increment(id) {
        data[id].taskCount = data[id].taskCount || 0;
        data[id].taskCount ++;
        return data[id].taskCount;
    },

    decrement: function decrement(id) {
        data[id].taskCount = data[id].taskCount || 0;
        data[id].taskCount --;
        return data[id].taskCount;
    }

};
