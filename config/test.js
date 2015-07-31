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
                    "threshold": 2
                }
            }
        ],
        "timeSeries": [
            [
                {
                    "id": "ford",
                    "filter": "fb.content contains \"ford\"",
                    "interval": "week",
                    "span": 2
                },
                {
                    "id": "honda",
                    "filter": "fb.content contains \"honda\"",
                    "interval": "week",
                    "span": 2
                }
            ]
        ]
    }
};