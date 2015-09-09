module.exports = {
    "app": {
        "format": "csv",
        "write_to_file": true,
        "log_level": "info"
    },
    "hash": "fd4f0cfef1807e327476ff60288bea78",
    "auth": {
        "username": "CS_2",
        "api_key": "5c15152f7086f7f3b2d2cc6b25648e94"
    },
    "analysis": {
        "freqDist": [
            /**
             * Global Data types
             */
                {
                    "name": "types_global",
                    "target": "fb.type",
                    "threshold": 10
                },
                {
                    "name": "media_types_global",
                    "target": "fb.media_type",
                    "threshold": 10
                },
                {
                    "name": "parent_media_types_global",
                    "target": "fb.parent.media_type",
                    "threshold": 10
                },
                {
                    "name": "author_type_global",
                    "target": "fb.author.type",
                    "threshold": 10
                },
                {
                    "name": "parent_author_type_global",
                    "target": "fb.parent.author.type",
                    "threshold": 10
                },
            /**
             * Media types by entity
             */
                {
                    "name": "media_types_by_entity",
                    "target": "interaction.tag_tree.automotive.brand",
                    "threshold": 6,
                    "child": {
                        "target": "fb.media_type",
                        "threshold": 6
                    }
                },
            /**
             * Type by entity
             */
                {
                    "name": "type",
                    "target": "interaction.tag_tree.automotive.brand",
                    "threshold": 6,
                    "child": {
                        "target": "fb.type",
                        "threshold": 6
                    }
                },
            /**
             * Total Entity Volumes
             */
                {
                    "name": "entity_volumes",
                    "target": "interaction.tag_tree.automotive.brand",
                    "threshold": 5
                },
            /**
             * Age Gender tornadoes
             */
                {
                    "name": "age_gender",
                    "target": "interaction.tag_tree.automotive.brand",
                    "threshold": 6,
                    "child": {
                        "target": "fb.author.age",
                        "threshold": 6,
                        "child": {
                            "target": "fb.author.gender",
                            "threshold": 2
                        }
                    }
                },
            /**
             * Entity volume by region
             */
                {
                    "name": "region_by_entity",
                    "target": "interaction.tag_tree.automotive.brand",
                    "threshold": 6,
                    "then": {
                        "target": "fb.author.region",
                        "threshold": 20
                    }
                },
            /**
             * URLs and domains
             */
                {
                    "name": "domains_by_entity",
                    "target": "interaction.tag_tree.automotive.brand",
                    "threshold": 6,
                    "then": {
                        "filter": "not links.domain in \"bit.ly, bitly.com, facebook.com\"",
                        "target": "links.domain",
                        "threshold": 25
                    }
                },
                {
                    "name": "links_by_entity",
                    "target": "interaction.tag_tree.automotive.brand",
                    "threshold": 6,
                    "then": {
                        "filter": "not links.domain in \"bit.ly, bitly.com, facebook.com\"",
                        "target": "links.url",
                        "threshold": 25
                    }
                },
            /**
             * Entity topics
             */
                {
                    "name": "topics_by_entity",
                    "target": "interaction.tag_tree.automotive.brand",
                    "threshold": 3,
                    "then": {
                        "target": "fb.topics.name",
                        "threshold": 100
                    }
                },
            /**
             * Topic hashtags
             */
                {
                    "name": "topic_hashtags",
                    "target": "fb.topics.name",
                    "threshold": 200,
                    "then": {
                        "target": "fb.hashtags",
                        "threshold": 50
                    }
                },
            /**
             * Entity timeSeries
             */
                {
                    "name": "timeSeries_by_entity",
                    "target": "interaction.tag_tree.automotive.brand",
                    "threshold": 30,
                    "then": {
                        "type": "timeSeries",
                        "interval": "day"
                    }
                }
        ],
        "timeSeries": [
            /**
             * Daily Volumes
             */
                {
                    "name": "timeSeries_by_day",
                    "interval": "day"
                },
            /**
             * Topics by day
             */
                {
                    "name": "topics_by_day",
                    "interval": "day",
                    "then": {
                        "type": "freqDist",
                        "target": "fb.topics.name",
                        "threshold": 100
                    }
                },
            /**
             * Hashtags by day
             */
                {
                    "name": "hashtags_by_day",
                    "interval": "day",
                    "then": {
                        "type": "freqDist",
                        "target": "fb.hashtags",
                        "threshold": 100
                    }
                },
            /**
             * Links by day
             */
                {
                    "name": "links_by_day",
                    "interval": "day",
                    "then": {
                        "type": "freqDist",
                        "target": "links.url",
                        "threshold": 100
                    }
                }
        ]
    }
};