"use strict";

module.exports = {
    "app": {
        "log_level": "debug"
    },
    "analysis": {
        "freqDist": [
            {
                "target": "fb.parent.author.gender",
                "threshold": 2,
                "then": {
                    "target": "fb.parent.author.age",
                    "threshold": 6
                }
            }
        ],
        "timeSeries": [
            [
                {
                    "name": "ford",
                    "filter": "fb.content contains \"ford\"",
                    "interval": "week",
                    "span": 1
                },
                {
                    "name": "honda",
                    "filter": "fb.content contains \"honda\"",
                    "interval": "week",
                    "span": 1
                }
            ]
        ]
    }
};