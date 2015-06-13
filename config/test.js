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
                    "threshold": 3
                }
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
