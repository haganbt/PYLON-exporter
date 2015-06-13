"use strict";

var bunyan = require("bunyan")
    , bformat = require("bunyan-format")
    , config = require("config")
    ;

/*eslint-disable*/
var log_level = config.get("app.log_level") || "info";

var formatOut = bformat({ outputMode: "short" })
    , logger = bunyan.createLogger({
        name: "PYLON-exporter",
        streams: [
            {
                level: log_level,
                stream: formatOut
            }
            /*
            //TODO add if you want logging to fs
             {
                level: 'error',
                // log ERROR and above to a file
                path: '/var/tmp/myapp-error.log'
             }
            */
        ]
    });

module.exports = logger;
/*eslint-enable*/
