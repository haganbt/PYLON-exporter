"use strict";

var bunyan = require("bunyan")
    , bformat = require("bunyan-format")
    , config = require("config")
    ;

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
                path: '/var/tmp/myapp-error.log'  // log ERROR and above to a file
             }
            */
        ]
    });

module.exports = logger;
