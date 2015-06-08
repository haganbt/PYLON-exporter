"use strict";

module.exports = {
    "analysis": {
        "freqDist": [
            {
                "target": "fb.parent.author.gender",
                "threshold": 2
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