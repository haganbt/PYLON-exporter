/*eslint-disable*/
var json2csv = require('json2csv');

var f = {
    "male": [
        {
            "key": "25-34",
            "interactions": 779200,
            "unique_authors": 594400
        },
        {
            "key": "18-24",
            "interactions": 518600,
            "unique_authors": 386200
        },
        {
            "key": "35-44",
            "interactions": 472300,
            "unique_authors": 349900
        },
        {
            "key": "45-54",
            "interactions": 309300,
            "unique_authors": 267800
        },
        {
            "key": "55-64",
            "interactions": 137000,
            "unique_authors": 111300
        },
        {
            "key": "65+",
            "interactions": 77000,
            "unique_authors": 60900
        }
    ],
    "female": [
        {
            "key": "25-34",
            "interactions": 523700,
            "unique_authors": 413900
        },
        {
            "key": "18-24",
            "interactions": 471500,
            "unique_authors": 387100
        },
        {
            "key": "35-44",
            "interactions": 393000,
            "unique_authors": 329300
        },
        {
            "key": "45-54",
            "interactions": 274700,
            "unique_authors": 216600
        },
        {
            "key": "55-64",
            "interactions": 124700,
            "unique_authors": 102100
        },
        {
            "key": "65+",
            "interactions": 55400,
            "unique_authors": 45000
        }
    ]
};


f = {
    "fb.parent.author.gender": [
        {
            "key": "male",
            "interactions": 2331700,
            "unique_authors": 1777800
        },
        {
            "key": "female",
            "interactions": 1862000,
            "unique_authors": 1485300
        }
    ],
    "fb.parent.author.age": [
        {
            "key": "25-34",
            "interactions": 1328500,
            "unique_authors": 1012200
        },
        {
            "key": "18-24",
            "interactions": 1006200,
            "unique_authors": 771300
        },
        {
            "key": "35-44",
            "interactions": 884200,
            "unique_authors": 712000
        },
        {
            "key": "45-54",
            "interactions": 595500,
            "unique_authors": 496400
        },
        {
            "key": "55-64",
            "interactions": 266700,
            "unique_authors": 208600
        },
        {
            "key": "65+",
            "interactions": 135800,
            "unique_authors": 109100
        }
    ]
};


f = { 'fb.content contains "ford"':
    [ { key: 1434931200, interactions: 1900, unique_authors: 1300 },
        { key: 1435536000, interactions: 30400, unique_authors: 18300 },
        { key: 1436140800, interactions: 51400, unique_authors: 37300 },
        { key: 1436745600, interactions: 71900, unique_authors: 51400 },
        { key: 1437350400, interactions: 79300, unique_authors: 55800 },
        { key: 1437955200, interactions: 21000, unique_authors: 16700 } ],
      'fb.content contains "honda"':
    [ { key: 1434931200, interactions: 1000, unique_authors: 700 },
        { key: 1435536000, interactions: 16200, unique_authors: 9200 },
        { key: 1436140800, interactions: 25000, unique_authors: 18300 },
        { key: 1436745600, interactions: 32600, unique_authors: 25700 },
        { key: 1437350400, interactions: 39500, unique_authors: 27200 },
        { key: 1437955200, interactions: 11500, unique_authors: 8200 } ] };

// Function to flattern a JSON object using the parent keys to
// create unique child elements. For example:
//
// {
//     "male": [
//          {
//              "key": "25-34",
//              "interactions": 779200,
//              "unique_authors": 594400
//          },
//          ....
//      ],
//     "female": [
//          {
//              "key": "25-34",
//              "interactions": 523700,
//              "unique_authors": 413900
//          },
//          ....
//      ]
// }
//
// ..and return an object with unique keys renamed based on the
// parent key name:
//
// {
//     "male_25-34": {
//          "interactions": 779200,
//          "unique_authors": 594400
//     },
//      "female_25-34": {
//          "interactions": 523700,
//          "unique_authors": 413900
//     }
// }
var out = {};
Object.keys(f).reduce(
    function(previousValue, currentValue) {
        //process each inner array of objects e.g. male
        f[currentValue].forEach(
            function(childObj) {
                // build a key e.g. "male_25-34"
                var key = currentValue + "_" + childObj.key;
                (function () {
                    for (var property in childObj) {
                        if (childObj.hasOwnProperty(property)) {
                            out[key] = out[key] || {};
                            out[key]["interactions"] = childObj.interactions;
                            out[key]["unique_authors"] = childObj.unique_authors;
                        }
                    }
                })(key);
            });
    },{}
);

/*
json2csv({ data: out }, function(err, csv) {
    if (err) console.log(err);
    console.log(csv);
});
*/

console.log("***************");
console.log(JSON.stringify(out));





/*eslint-enable*/