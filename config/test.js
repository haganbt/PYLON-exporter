"use strict";

module.exports = {
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
