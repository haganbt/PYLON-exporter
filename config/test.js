"use strict";

module.exports = {
    "app": {
        "log_level": "debug"
    },
    "analysis": {
        "freqDist": [
            [
                {
                    "target": "links.domain",
                    "threshold": 2
                },
                {
                    "target": "fb.parent.author.gender",
                    "threshold": 2
                }
            ],
            {
                "target": "links.url",
                "threshold": 2
            },
            {
                "target": "fb.parent.topics.name",
                "threshold": 5,
                "then": {
                    "target": "fb.parent.topics.name",
                    "threshold": 2
                }
            }
        ]
    }
};
