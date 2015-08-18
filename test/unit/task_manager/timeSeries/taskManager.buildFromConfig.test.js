"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var taskManager = require('../../../../lib/taskManager')
    ;

describe("Task Manager buildFromConfig - timeSeries", function(){

    it("should build from single target task", function(){
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

    it("should build from single target task - start/end", function(){
        var taskConfig = {
            "timeSeries": [
                {
                    "start": 1234,
                    "end": 5678,
                    "filter": "fb.content exists",
                    "interval": "week",
                    "span": 1
                }
            ]
        };

        var config = taskManager.buildFromConfig(taskConfig);
        expect(config[0].json.start).to.equal(1234);
        expect(config[0].json.end).to.equal(5678);
    });

    it("should build from single target task - name", function(){
        var taskConfig = {
            "timeSeries": [
                {
                    "name": "foo",
                    "filter": "fb.content exists",
                    "interval": "week",
                    "span": 1
                }
            ]
        };
        var config = taskManager.buildFromConfig(taskConfig);
        expect(config[0].name).to.equal("foo");
    });

    it("should build from single target task - auto name", function(){
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
        expect(config[0].name).to.equal("fb.content exists--span_week");
    });

    it("should build from 2 merged tasks", function(){
        var taskConfig = {
            "timeSeries": [
                {
                    "example_merged_timeSeries": [
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
                }
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

    it("should build from 2 merged tasks - start/end", function(){
        var taskConfig = {
            "timeSeries": [
                {
                    "example_merged_timeSeries": [
                        {
                            "start": 1234,
                            "end": 5678,
                            "filter": "fb.content contains \"bar\"",
                            "interval": "week",
                            "span": 1
                        },
                        {
                            "start": 910,
                            "end": 1213,
                            "filter": "fb.content contains \"foo\"",
                            "interval": "week",
                            "span": 1
                        }
                    ]
                }
            ]
        };
        var config = taskManager.buildFromConfig(taskConfig);

        expect(config[0].json.start).to.equal(1234);
        expect(config[0].json.end).to.equal(5678);
        expect(config[1].json.start).to.equal(910);
        expect(config[1].json.end).to.equal(1213);
    });

    //todo - id property
});
