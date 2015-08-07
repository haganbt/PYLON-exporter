"use strict";

/**
 * jsonToCsv - process the 3 JSON object types. See
 * /test/support/recipes/response.payloads.js for
 * examples.
 *
 * @param inObj - JSON object
 * @param cb - err first cb
 * @returns {string}
 */
var jsonToCsv = function jsonToCsv(inObj, cb) {
    var out = "";

    if(inObj.redacted){
        return cb(null, "redacted");
    }

    if (Array.isArray(inObj)) {
        if(inObj[0] && inObj[0].child){
            out = "category,key,interactions,unique_authors\n";
        } else {
            out = "key,interactions,unique_authors\n";
        }
        inObj.forEach(function(level0) {
            // nested result set
            if(level0.child){
                var l1Results = level0.child.results;
                l1Results.forEach(function(level1) {
                    var l1ResultsKey = level1.key;
                    if(level1.child) {
                        var l2Results = level1.child.results;
                        l2Results.forEach(function (l2ResultsResults) {
                            out += level0.key + "," + l1ResultsKey + "," +
                                l2ResultsResults.key + "," +
                                l2ResultsResults.interactions +
                                "," + l2ResultsResults.unique_authors + "\n";
                        });
                    } else {
                        out += level0.key + "," + level1.key + "," +
                            level1.interactions + "," + level1.unique_authors
                            + "\n";
                    }
                });
            } else {
                // non nested
                out += level0.key + "," + level0.interactions + "," +
                    level0.unique_authors + "\n";
            }
        });
    } else {
        out += "category,key,interactions,unique_authors\n";
        Object.keys(inObj).reduce(
            function(previousValue, currentValue) {

                if(inObj[currentValue].redacted){
                    out += currentValue + ",redacted\n";
                } else {
                    inObj[currentValue].forEach(
                        function(childObj) {
                            out += currentValue + "," +
                                childObj.key + "," + childObj.interactions +
                                "," + childObj.unique_authors + "\n";
                        });
                }
            }, {}
        );
    }
    return cb(null, out);
};

exports.jsonToCsv = jsonToCsv;
