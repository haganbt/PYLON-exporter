"use strict";

module.exports = {
    "app": {
        "max_parallel_tasks": 1
    },
    "analysis": {
        "freqDist": [
            {
                "target": "fb.parent.topics.name",
                "threshold": 5,
                "then": {
                    "target": "fb.parent.topics.name",
                    "threshold": 2
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
