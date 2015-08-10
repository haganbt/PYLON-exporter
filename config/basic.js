"use strict";

module.exports = {
    "app": {
        "format": "json", // json, csv
        "write_to_file": false, // true, false
    },
    "hash": "<INDEX_HASH>",
    "auth": {
        "username": "<INDEX_USERNNAME>",
        "api_key": "<API_KEY>"
    },
    "analysis": {
        "freqDist": [
            {
                "name": "example_freqDist",
                "target": "fb.parent.topics.name",
                "threshold": 3
            }
        ],
        "timeSeries": [
            {
                "name": "example_timeSeries",
                "interval": "week",
                "span": 2
            }
        ]
    }
};