"use strict";

/**
 * example JSON response payloads
 */

var arrayOfObjects = [
        {
            "key": "BMW",
            "interactions": 4220100,
            "unique_authors": 3058300
        },
        {
            "key": "Ford Motor Company",
            "interactions": 1259300,
            "unique_authors": 720300
        },
        {
            "key": "Ford Mustang",
            "interactions": 1167600,
            "unique_authors": 699200
        }
];

var arrayOfObjectsTs = [
    {
        key: 1435795200,
        interactions: 1427400,
        unique_authors: 1003600
    },
    {
        key: 1437004800,
        interactions: 6715000,
        unique_authors: 4535800
    },
    {
        key: 1438214400,
        interactions: 5860700,
        unique_authors: 3911900
    }
];

var arrayOfObjRedacted = {
    "redacted": true
};



var mergedObject = {
    "ford": [
        {
            "key": "25-34",
            "interactions": 565400,
            "unique_authors": 432800
        },
        {
            "key": "35-44",
            "interactions": 464500,
            "unique_authors": 372200
        }
    ],
    "honda": [
        {
            "key": "25-34",
            "interactions": 366500,
            "unique_authors": 296600
        },
        {
            "key": "18-24",
            "interactions": 269700,
            "unique_authors": 204200
        }
    ]
};

var mergedObjectTs = {
    "ford": [
        {
            "key": 1435795200,
            "interactions": 665600,
            "unique_authors": 442100
        },
        {
            "key": 1437004800,
            "interactions": 2487200,
            "unique_authors": 1576900
        },
        {
            "key": 1438214400,
            "interactions": 2049100,
            "unique_authors": 1391500
        }
    ],
    "honda": [
        {
            "key": 1435795200,
            "interactions": 193000,
            "unique_authors": 151900
        },
        {
            "key": 1437004800,
            "interactions": 958600,
            "unique_authors": 786000
        },
        {
            "key": 1438214400,
            "interactions": 727000,
            "unique_authors": 570800
        }
    ]
};

var mrgObjSingleRedacted = {
    "ford": {
        "redacted": true
    },
    "honda": [
        {
            "key": "25-34",
            "interactions": 373700,
            "unique_authors": 297900
        },
        {
            "key": "18-24",
            "interactions": 273800,
            "unique_authors": 205100
        }
    ]
};

var mrgObjDoubleRedact = {
    "ford": {
        "redacted": true
    },
    "honda": {
        "redacted": true
    }
};

var OneLevelNestObj = [
    {
        "key": "BMW",
        "interactions": 5963300,
        "unique_authors": 3973700,
        "child": {
            "analysis_type": "freqDist",
            "parameters": {
                "target": "fb.author.gender",
                "threshold": 2
            },
            "results": [
                {
                    "key": "male",
                    "interactions": 3935900,
                    "unique_authors": 2493500
                },
                {
                    "key": "female",
                    "interactions": 1801000,
                    "unique_authors": 1475400
                }
            ],
            "redacted": false
        }
    },
    {
        "key": "Ford",
        "interactions": 5484100,
        "unique_authors": 3164800,
        "child": {
            "analysis_type": "freqDist",
            "parameters": {
                "target": "fb.author.gender",
                "threshold": 2
            },
            "results": [
                {
                    "key": "male",
                    "interactions": 3390100,
                    "unique_authors": 1733100
                },
                {
                    "key": "female",
                    "interactions": 1907800,
                    "unique_authors": 1449800
                }
            ],
            "redacted": false
        }
    },
    {
        "key": "Honda",
        "interactions": 2028900,
        "unique_authors": 1584900,
        "child": {
            "analysis_type": "freqDist",
            "parameters": {
                "target": "fb.author.gender",
                "threshold": 2
            },
            "results": [
                {
                    "key": "female",
                    "interactions": 1014600,
                    "unique_authors": 844800
                },
                {
                    "key": "male",
                    "interactions": 931200,
                    "unique_authors": 639700
                }
            ],
            "redacted": false
        }
    }
];

var TwoLevelNestObj = [
    {
        "key": "BMW",
        "interactions": 5954400,
        "unique_authors": 3955300,
        "child": {
            "analysis_type": "freqDist",
            "parameters": {
                "target": "fb.author.gender",
                "threshold": 2
            },
            "results": [
                {
                    "key": "male",
                    "interactions": 3928500,
                    "unique_authors": 2493500,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.author.age",
                            "threshold": 6
                        },
                        "results": [
                            {
                                "key": "18-24",
                                "interactions": 1293900,
                                "unique_authors": 810600
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "female",
                    "interactions": 1799500,
                    "unique_authors": 1474600,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.author.age",
                            "threshold": 6
                        },
                        "results": [
                            {
                                "key": "25-34",
                                "interactions": 499700,
                                "unique_authors": 404400
                            },
                            {
                                "key": "18-24",
                                "interactions": 420500,
                                "unique_authors": 323400
                            }
                        ],
                        "redacted": false
                    }
                }
            ],
            "redacted": false
        }
    },
    {
        "key": "Ford",
        "interactions": 5482500,
        "unique_authors": 3158400,
        "child": {
            "analysis_type": "freqDist",
            "parameters": {
                "target": "fb.author.gender",
                "threshold": 2
            },
            "results": [
                {
                    "key": "male",
                    "interactions": 3390800,
                    "unique_authors": 1736300,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.author.age",
                            "threshold": 6
                        },
                        "results": [
                            {
                                "key": "25-34",
                                "interactions": 871700,
                                "unique_authors": 465100
                            },
                            {
                                "key": "55-64",
                                "interactions": 287000,
                                "unique_authors": 123900
                            },
                            {
                                "key": "65+",
                                "interactions": 152300,
                                "unique_authors": 74500
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "female",
                    "interactions": 1905800,
                    "unique_authors": 1440200,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.author.age",
                            "threshold": 6
                        },
                        "results": [
                            {
                                "key": "25-34",
                                "interactions": 415400,
                                "unique_authors": 330700
                            },
                            {
                                "key": "35-44",
                                "interactions": 414300,
                                "unique_authors": 337800
                            }
                        ],
                        "redacted": false
                    }
                }
            ],
            "redacted": false
        }
    },
    {
        "key": "Honda",
        "interactions": 2027000,
        "unique_authors": 1569500,
        "child": {
            "analysis_type": "freqDist",
            "parameters": {
                "target": "fb.author.gender",
                "threshold": 2
            },
            "results": [
                {
                    "key": "female",
                    "interactions": 1014100,
                    "unique_authors": 838300,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.author.age",
                            "threshold": 6
                        },
                        "results": [
                            {
                                "key": "25-34",
                                "interactions": 258100,
                                "unique_authors": 211500
                            },
                            {
                                "key": "35-44",
                                "interactions": 212300,
                                "unique_authors": 164800
                            }
                        ],
                        "redacted": false
                    }
                },
                {
                    "key": "male",
                    "interactions": 929900,
                    "unique_authors": 644200,
                    "child": {
                        "analysis_type": "freqDist",
                        "parameters": {
                            "target": "fb.author.age",
                            "threshold": 6
                        },
                        "results": [
                            {
                                "key": "25-34",
                                "interactions": 316700,
                                "unique_authors": 217900
                            },
                            {
                                "key": "65+",
                                "interactions": 29700,
                                "unique_authors": 23700
                            }
                        ],
                        "redacted": false
                    }
                }
            ],
            "redacted": false
        }
    }
];

exports.arrayOfObjects = arrayOfObjects;
exports.arrayOfObjectsTs = arrayOfObjectsTs;
exports.arrayOfObjRedacted = arrayOfObjRedacted;
exports.mergedObject = mergedObject;
exports.mergedObjectTs = mergedObjectTs;
exports.mrgObjSingleRedacted = mrgObjSingleRedacted;
exports.mrgObjDoubleRedact = mrgObjDoubleRedact;
exports.OneLevelNestObj = OneLevelNestObj;
exports.TwoLevelNestObj = TwoLevelNestObj;
