"use strict";

module.exports = {
    "app": {
        "log_level": "debug"
    },
    "analysis": {
        "freqDist": [
            {
                "name": "example_freqDist-parent_topics",
                "target": "fb.parent.topics.name",
                "threshold": 10
            },
            {
                "name": "example_nested_query-freqDist_age_by_gender",
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
                "name": "example_timeSeries",
                "interval": "week",
                "span": 2
            },
            {
                "example_merged_timeSeries_brands_by_week": [
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
            }
        ]
    }
};