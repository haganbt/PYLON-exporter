'use strict';
var data = {};

var set = function set(id) {
    data[id] = { "jobCount": 0 };
    return data[id];
};

var get = function get(id) {
    return data[id];
};

var getAll = function getAll() {
    return data;
};

var add = function add(id, key, newData) {


    if(newData == undefined){
        data[id].jobCount ++;
    } else {
        data[id].jobCount --;
    }

    newData = newData || {};



    data[id][key] = newData;
    return data[id];
};


exports.set = set;
exports.get = get;
exports.getAll = getAll;
exports.add = add;

/*

module.exports = function () {
    'use strict';
    var data = {}
        ,values = [];

    return {
        set: function create(id) {
            data[id] = {
                data: []
            };
            return data[id];
        },
        get: function get(id, cb) {
            cb(null, data[id]);
        },
        update: function update(id, newData, cb) {
            data[id].data.push(newData);
            cb(null);
        },
        destroy: function destroy(id, cb) {
            delete data[id];
            cb(null);
        },
        addValue: function (id, newData, cb) {
            values.push({
                value: newData,
                timestamp : Date.now
            });
            cb(null);
        }
    };
};
*/