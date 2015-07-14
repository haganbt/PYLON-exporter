"use strict";

module.exports = {
    "app": {
        "log_level": "debug"
    },
    "analysis": {
        "freqDist": [
            {
                "target": "fb.parent.topics.name",
                "threshold": 20,
                "then": {
                    "target": "fb.parent.topics.name",
                    "threshold": 5
                }
            }
        ]
    }
};
