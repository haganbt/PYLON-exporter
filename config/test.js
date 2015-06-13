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
            },
            {
                "target": "fb.parent.topics.name",
                "threshold": 10,
                "then": {
                    "target": "fb.parent.topics.name",
                    "threshold": 3
                }
            }
        ]
    }
};
