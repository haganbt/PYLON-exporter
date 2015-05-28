"use strict";

module.exports = {
    "hash": "b5566a154bb6dcd19b52b3b431e59373",
    "auth": {
        "username": "CS_2",
        "api_key": "5c15152f7086f7f3b2d2cc6b25648e94"
    },
    "analysis": {
        "freqDist": [
            {
                "target": "fb.parent.author.gender",
                "threshold": 3,
                "then": {
                    "target": "fb.parent.author.age",
                    "threshold": 10
                }
            },
            {
                "target": "fb.type",
                "threshold": 5
            }
        ],
        "timeSeries": [
            {
                "interval": "week",
                "span": 1
            }
        ]
    }
};

