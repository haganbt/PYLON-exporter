"use strict";

module.exports = {
    "app": {
        "format": "json", // json, csv
        "write_to_file": false, // true, false
    },
    "id": "<INDEX_ID>",
    "auth": {
        "username": "<USERNNAME>",
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