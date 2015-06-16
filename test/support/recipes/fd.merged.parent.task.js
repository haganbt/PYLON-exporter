"use strict";

module.exports = {
    "freqDist": [
        [
            {
                "target": "fb.parent.author.gender",
                "threshold": 2,
                "filter": "links.domain exists"
            },
            {
                "target": "fb.parent.author.age",
                "threshold": 2,
                "filter": "not links.domain exists"
            }
        ]
    ]
};
