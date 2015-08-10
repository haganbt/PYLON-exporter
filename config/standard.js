"use strict";

module.exports = {
    "analysis": {
        "freqDist": [
            {
                "name": "freqDist_tags",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10
            },
            {
                "name": "freqDist_top_topics_by_tag",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "then": {
                    "target": "fb.topics.name",
                    "threshold": 20
                }
            },
            {
                "name": "freqDist_top_hashtags_by_tag",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "then": {
                    "target": "fb.hashtags",
                    "threshold": 20
                }
            },
            {
                "name": "freqDist_age_gender_by_tag",
                "target": "interaction.tag_tree.automotive.brand",
                "threshold": 10,
                "child": {
                    "target": "fb.author.gender",
                    "threshold": 2,
                    "child": {
                        "target": "fb.author.age",
                        "threshold": 6
                    }
                }
            },
            {
                "name": "freqDist_age_gender_by_tag",
                "target": "fb.author.gender",
                "threshold": 2,
                "then": {
                    "target": "fb.author.age",
                    "threshold": 6
                }
            }
        ],
        "timeSeries": [/*
            {
                "timeSeries_tag_by_hour": [
                    {
                        "id": "ford",
                        "filter": "interaction.tag_tree.automotive.brand == \"ford\"",
                        "interval": "hour"
                    },
                    {
                        "id": "honda",
                        "filter": "interaction.tag_tree.automotive.brand == \"honda\"",
                        "interval": "hour"
                    },
                    {
                        "id": "bmw",
                        "filter": "interaction.tag_tree.automotive.brand == \"bmw\"",
                        "interval": "hour"
                    }
                ]
            },
            {
                "timeSeries_fb_type_per_tag": [
                    {
                        "id": "like_ford",
                        "filter": "fb.type == \"like\" and interaction.tag_tree.automotive.brand == \"ford\"",
                        "interval": "hour"
                    },
                    {
                        "id": "story_ford",
                        "filter": "fb.type == \"story\" and interaction.tag_tree.automotive.brand == \"ford\"",
                        "interval": "hour"
                    },
                    {
                        "id": "comment_ford",
                        "filter": "fb.type == \"comment\" and interaction.tag_tree.automotive.brand == \"ford\"",
                        "interval": "hour"
                    },
                    {
                        "id": "reshare_ford",
                        "filter": "fb.type == \"reshare\" and interaction.tag_tree.automotive.brand == \"ford\"",
                        "interval": "hour"
                    },
                    {
                        "id": "like_honda",
                        "filter": "fb.type == \"like\" and interaction.tag_tree.automotive.brand == \"honda\"",
                        "interval": "hour"
                    },
                    {
                        "id": "story_honda",
                        "filter": "fb.type == \"story\" and interaction.tag_tree.automotive.brand == \"honda\"",
                        "interval": "hour"
                    },
                    {
                        "id": "comment_honda",
                        "filter": "fb.type == \"comment\" and interaction.tag_tree.automotive.brand == \"honda\"",
                        "interval": "hour"
                    },
                    {
                        "id": "reshare_honda",
                        "filter": "fb.type == \"reshare\" and interaction.tag_tree.automotive.brand == \"honda\"",
                        "interval": "hour"
                    },
                    {
                        "id": "like_bmw",
                        "filter": "fb.type == \"like\" and interaction.tag_tree.automotive.brand == \"bmw\"",
                        "interval": "hour"
                    },
                    {
                        "id": "story_bmw",
                        "filter": "fb.type == \"story\" and interaction.tag_tree.automotive.brand == \"bmw\"",
                        "interval": "hour"
                    },
                    {
                        "id": "comment_bmw",
                        "filter": "fb.type == \"comment\" and interaction.tag_tree.automotive.brand == \"bmw\"",
                        "interval": "hour"
                    },
                    {
                        "id": "reshare_bmw",
                        "filter": "fb.type == \"reshare\" and interaction.tag_tree.automotive.brand == \"bmw\"",
                        "interval": "hour"
                    }
                ]
            }*/
        ]
    }
};