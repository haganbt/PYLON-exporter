"use strict";

module.exports = {
    "freqDist": [
        [
            {
                "target": "fb.parent.author.gender",
                "threshold": 3,
                "filter": "links.domain exists"
            },
            {
                "target": "fb.parent.author.age",
                "threshold": 5,
                "filter": "not links.domain exists"
            }
        ]
    ]
};
