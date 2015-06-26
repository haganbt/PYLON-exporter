"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var taskManager = require('../../../../lib/taskManager')
    ;

describe("Task Manager buildFromConfig - timeSeries", function(){

    it("should build from - single target task", function(){

        var taskConfig = {
            "timeSeries": [
                {
                    "filter": "fb.content exists",
                    "interval": "week",
                    "span": 1
                }
            ]
        };

        var config = taskManager.buildFromConfig(taskConfig);

        config.should.be.an('array');
        expect(config).to.have.length(1);

        expect(config[0].json)
            .to.have.keys("hash", "filter", "start", "end", "parameters");

        expect(config[0].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[0].json.parameters.analysis_type).to.equal("timeSeries");
        expect(config[0].json.parameters.parameters.interval)
            .to.equal("week");

        expect(config[0].json.parameters.parameters.span)
            .to.equal(1);
    });


    it("should build from - 2 targets merged", function(){

        var taskConfig = {
            "timeSeries": [
                [
                    {
                        "filter": "fb.content contains \"bar\"",
                        "interval": "week",
                        "span": 1
                    },
                    {
                        "filter": "fb.content contains \"foo\"",
                        "interval": "week",
                        "span": 1
                    }
                ]
            ]
        };

        var config = taskManager.buildFromConfig(taskConfig);

        config.should.be.an('array');
        expect(config).to.have.length(2);

        expect(config[0].json)
            .to.have.keys("hash", "filter", "start", "end", "parameters");

        expect(config[0].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[0].json.parameters.analysis_type).to.equal("timeSeries");

        expect(config[0].json.filter).to.equal("fb.content contains \"bar\"");
        expect(config[0].json.parameters.parameters.interval)
            .to.equal("week");

        expect(config[0].json.parameters.parameters.span)
            .to.equal(1);


        expect(config[1].json)
            .to.have.keys("hash", "filter", "start", "end", "parameters");

        expect(config[1].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[1].json.parameters.analysis_type).to.equal("timeSeries");

        expect(config[1].json.filter).to.equal("fb.content contains \"foo\"");
        expect(config[1].json.parameters.parameters.interval)
            .to.equal("week");

        expect(config[1].json.parameters.parameters.span)
            .to.equal(1);
    });

});
