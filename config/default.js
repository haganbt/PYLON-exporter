"use strict";
var moment = moment = require('moment');

module.exports = {
    "app": {
        "format": "json", // json, csv
        "write_to_file": false, // true, false
        "max_parallel_tasks": 3, // number of parallel requests
        "log_level": "info" // info, warn, debug
    },
    "time": {
    	"start": moment.utc().subtract(1, 'month').unix(),
        "end": moment.utc().unix()
    }
};
