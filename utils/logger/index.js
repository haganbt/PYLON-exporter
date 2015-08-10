"use strict";

var bunyan = require("bunyan")
    , bformat = require("bunyan-format")
    , config = require("config")
    ;

/*eslint-disable*/
var log_level = config.get("app.log_level") || "info";

var formatOut = bformat({ outputMode: "short" })
    , logger = bunyan.createLogger({
        name: "SE-PYLON-exporter",
        streams: [
            {
                level: log_level,
                stream: formatOut
            }/*,
            {
                level: 'info',
                // log ERROR and above to a file
                path: './output/test.log'
            }*/
        ]
    });

module.exports = logger;
/*eslint-enable*/
