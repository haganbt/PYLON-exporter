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
         * Media types by entity
         */
            {
                "name": "media_types",
                "target": "interaction.tag_tree.standard",
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
                "target": "interaction.tag_tree.standard",
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
                "target": "interaction.tag_tree.standard",
                "threshold": 5
            },
        /**
         * Age Gender tornadoes
         */
            {
                "name": "age_gender",
                "target": "interaction.tag_tree.standard",
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
                "target": "interaction.tag_tree.standard",
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
                "target": "interaction.tag_tree.standard",
                "threshold": 6,
                "then": {
                    "filter": "not links.domain in \"bit.ly, bitly.com, facebook.com\"",
                    "target": "links.domain",
                    "threshold": 25
                }
            },
            {
                "name": "links_by_entity",
                "target": "interaction.tag_tree.standard",
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
                "target": "interaction.tag_tree.standard",
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
                "target": "interaction.tag_tree.standard",
                "threshold": 30,
                "then": {
                    "type": "timeSeries",
                    "interval": "day"
                }
            }
        ],
        "timeSeries": [
        ]
    }
};