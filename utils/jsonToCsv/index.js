"use strict";

/**
 * jsonToCsv - process the 3 JSON object types. See
 * /test/support/recipes/response.payloads.js for
 * examples.
 *
 * @param inObj
 * @returns promist(string)
 */
var jsonToCsv = function jsonToCsv(inObj) {
    return new Promise(function(resolve, reject){
        var out = "";
        if(inObj.redacted){
            reject("redacted");
        }
        if (Array.isArray(inObj)) {
            // single level nested
            if (inObj[0] && inObj[0].child && !inObj[0].child.results[0].child){
                out = "category,key,interactions,unique_authors\n";
                // two level nested
            } else if(inObj[0] && inObj[0].child && inObj[0].child.results[0]
                && inObj[0].child.results[0].child){
                out = "name,category,key,interactions,unique_authors\n";
                // single item array
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
            out = "category,key,interactions,unique_authors\n";
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
        resolve(out);
    });
};

exports.jsonToCsv = jsonToCsv;
