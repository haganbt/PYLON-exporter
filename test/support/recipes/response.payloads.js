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

var ObjectKeyArrays = {
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

exports.arrayOfObjects = arrayOfObjects;
exports.ObjectKeyArrays = ObjectKeyArrays;
