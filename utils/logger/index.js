'use strict';

var bunyan = require('bunyan')
    , bformat = require('bunyan-format')
    ;

var formatOut = bformat({ outputMode: 'short' })
    , logger = bunyan.createLogger({
        name: 'PYLON-exporter',
        streams: [
            {
                level: "debug",
                stream: formatOut
            }
            /*
            //TODO add if you want logging to fs
            {
                path: path.resolve(logFilePath)
            }
            */
        ]
    });

module.exports = logger;