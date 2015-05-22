"use strict";

module.exports = {
    "analysis": {
        "freqDist": [
            {
                "target": "fb.author.age",
                "threshold": 10
            },
            {
                "target": "fb.author.country",
                "threshold": 10
            }
        ],
        "timeSeries": [
            {
                "interval": "hour",
                "span": 1
            }
        ]
    }
};

