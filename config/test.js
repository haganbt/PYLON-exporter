"use strict";

module.exports = {
    "app": {
        "log_level": "debug"
    },
    "analysis": {
        "freqDist": [
            {
                "name": "freqDist_age_by_gender",
                "target": "fb.parent.author.gender",
                "threshold": 2,
                "then": {
                    "target": "fb.parent.author.age",
                    "threshold": 2
                }
            }
        ],
        "timeSeries": [
            {
                "timeSeries_brands_by_week": [
                    {
                        "id": "ford",
                        "filter": "fb.parent.content contains \"ford\"",
                        "interval": "week",
                        "span": 2
                    },
                    {
                        "id": "honda",
                        "filter": "fb.parent.content contains \"honda\"",
                        "interval": "week",
                        "span": 2
                    }
                ]
            },
            {
                "name": "timeSeries_example",
                "filter": "fb.parent.content exists",
                "interval": "week",
                "span": 2
            }
        ]
    }
};