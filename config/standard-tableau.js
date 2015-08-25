var entity_tag_name =   "interaction.tag_tree.automotive.brand";

"use strict";
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
             * Data types by brand
             */
            {
                "name": "media_types",
                "target": entity_tag_name,
                "threshold": 6,
                "child": {
                    "target": "fb.media_type",
                    "threshold": 6
                }
            },
            /**
             * Total Brand Volumes
             */
            {
                "name": "brand_volumes",
                "target": entity_tag_name,
                "threshold": 5
            },
            /**
             * Age Gender tornadoes
             */
            {
                "name": "age_gender",
                "target": entity_tag_name,
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
             * Brand volume by region
             */
            {
                "name": "brand_region",
                "target": entity_tag_name,
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
                "name": "domains_by_brand",
                "target": entity_tag_name,
                "threshold": 6,
                "then": {
                    "filter": "not links.domain in \"bit.ly, bitly.com, facebook.com\"",
                    "target": "links.domain",
                    "threshold": 25
                }
            },
            {
                "name": "links_by_brand",
                "target": entity_tag_name,
                "threshold": 6,
                "then": {
                    "filter": "not links.domain in \"bit.ly, bitly.com, facebook.com\"",
                    "target": "links.url",
                    "threshold": 25
                }
            },
            /**
             * brand topics
             */
            {
                "name": "topics_by_brand",
                "target": entity_tag_name,
                "threshold": 3,
                "then": {
                    "target": "fb.topics.name",
                    "threshold": 100
                }
            },
            /**
             * topic hashtags
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
             * entity timeSeries
             */
            {
                "name": "timeSeries_by_tag",
                "target": entity_tag_name,
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