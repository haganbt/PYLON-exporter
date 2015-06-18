"use strict";

module.exports = {
    "freqDist": [
        {
            "target": "fb.parent.author.gender",
            "threshold": 2,
            "then": {
                "target": "fb.parent.author.age",
                "threshold": 4
            }
        }
    ]
};
