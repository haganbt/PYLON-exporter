"use strict";

module.exports = {
    "hash": "<INDEX_HASH>",
    "auth": {
        "username": "<USERNNAME>",
        "api_key": "<API_KEY>"
    },
    //"start": <UNIX_TS>, //override default 30 days
    //"end":  <UNIX_TS>,
    "analysis": {
        "freqDist": [
            {
                "name": "example_freqDist",
                "target": "fb.parent.topics.name",
                "threshold": 3
            },
            {
                "example_merged_freqDist": [
                    {
                        "id": "ford",
                        "filter": "fb.parent.content contains \"ford\"",
                        "target": "fb.parent.author.age",
                        "threshold": 2
                    },
                    {
                        "id": "honda",
                        "filter": "fb.parent.content contains \"honda\"",
                        "target": "fb.parent.author.age",
                        "threshold": 2
                    }
                ]
            },
            {
                "name": "example_native_nested",
                "target": "fb.author.gender",
                "threshold": 2,
                "child": {
                    "target": "fb.author.age",
                    "threshold": 2,
                    "child": {
                        "target": "fb.parent.media_type",
                        "threshold": 2
                    }
                }
            },
            {
                "name": "example_custom_nested",
                "target": "fb.parent.author.gender",
                "threshold": 2,
                "then": {
                    "target": "fb.parent.author.age",
                    "threshold": 2
                }
            },
            {
                "name": "example_freqDist_nested_type_override",
                "target": "fb.author.gender",
                "threshold": 2,
                "then": {
                    "type": "timeSeries",
                    "interval": "week"
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
                "name": "example_timeSeries_nested_type_override",
                "interval": "week",
                "then": {
                    "type": "freqDist",
                    "target": "fb.author.gender",
                    "threshold": 2
                }
            },
            {
                "example_merged_timeSeries": [
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