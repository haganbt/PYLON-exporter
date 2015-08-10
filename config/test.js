"use strict";

module.exports = {
    "app": {
        "format": "csv"
    },
    "hash": "fd4f0cfef1807e327476ff60288bea78",
    "auth": {
        "username": "CS_2",
        "api_key": "5c15152f7086f7f3b2d2cc6b25648e94"
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
