"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var taskManager = require('../../../../lib/taskManager')
    ;

describe("Task Manager buildFromConfig - freqDist", function(){

    it("should build from single target task", function(){
        var taskConfig = {
                "freqDist": [
                    {
                        "target": "fb.parent.author.gender",
                        "threshold": 2,
                        "filter": "links.domain exists"
                    }
                ]
            };

        var config = taskManager.buildFromConfig(taskConfig);

        config.should.be.an('array');
        expect(config).to.have.length(1);

        expect(config[0].json)
            .to.have.keys("id", "filter", "start", "end", "parameters");

        expect(config[0].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[0].json.parameters.analysis_type).to.equal("freqDist");
        expect(config[0].json.parameters.parameters.target)
            .to.equal("fb.parent.author.gender");

        expect(config[0].json.parameters.parameters.threshold).to.equal(2);
    });

    it("should build from single target task - start/end", function(){
        var taskConfig = {
            "freqDist": [
                {
                    "start": 1234,
                    "end": 5678,
                    "target": "fb.parent.author.gender",
                    "threshold": 2,
                    "filter": "links.domain exists"
                }
            ]
        };

        var config = taskManager.buildFromConfig(taskConfig);
        expect(config[0].json.start).to.equal(1234);
        expect(config[0].json.end).to.equal(5678);
    });

    it("should build from 2 merged tasks", function(){
        var taskConfig = {
            "freqDist": [
                {
                    "example_merged_freqDist": [
                        {
                            "target": "fb.parent.author.gender",
                            "threshold": 3,
                            "filter": "links.domain exists"
                        },
                        {
                            "target": "fb.parent.author.age",
                            "threshold": 5,
                            "filter": "not links.domain exists"
                        }
                    ]
                }
            ]
        };

        var config = taskManager.buildFromConfig(taskConfig);

        config.should.be.an('array');
        expect(config).to.have.length(2);

        expect(config[0].json)
            .to.have.keys("id", "filter", "start", "end", "parameters");

        expect(config[0].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[0].json.parameters.analysis_type).to.equal("freqDist");
        expect(config[0].json.filter).to.equal("links.domain exists");
        expect(config[0].json.parameters.parameters.target)
            .to.equal("fb.parent.author.gender");

        expect(config[0].json.parameters.parameters.threshold).to.equal(3);


        expect(config[1].json)
            .to.have.keys("id", "filter", "start", "end", "parameters");

        expect(config[1].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[1].json.parameters.analysis_type).to.equal("freqDist");
        expect(config[1].json.filter).to.equal("not links.domain exists");
        expect(config[1].json.parameters.parameters.target)
            .to.equal("fb.parent.author.age");

        expect(config[1].json.parameters.parameters.threshold).to.equal(5);
    });

    it("should build from 2 merged tasks - start/end", function(){
        var taskConfig = {
            "freqDist": [
                {
                    "example_merged_freqDist": [
                        {
                            "start": 1234,
                            "end": 5678,
                            "target": "fb.parent.author.gender",
                            "threshold": 3,
                            "filter": "links.domain exists"
                        },
                        {
                            "start": 910,
                            "end": 1213,
                            "target": "fb.parent.author.age",
                            "threshold": 5,
                            "filter": "not links.domain exists"
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

    it("should build from custom merged task", function(){
        var taskConfig = {
            "freqDist": [
                {
                    "target": "fb.parent.author.gender",
                    "threshold": 2,
                    "filter": "links.domain exists",
                    "then": {
                        "target": "fb.parent.author.age",
                        "threshold": 4
                    }
                }
            ]
        };

        var config = taskManager.buildFromConfig(taskConfig);

        config.should.be.an('array');
        expect(config).to.have.length(1);

        expect(config[0].json)
            .to.have.keys("id", "filter", "start", "end", "parameters");

        expect(config[0].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[0].json.parameters.analysis_type).to.equal("freqDist");
        expect(config[0].json.filter).to.equal("links.domain exists");
        expect(config[0].json.parameters.parameters.target)
            .to.equal("fb.parent.author.gender");

        expect(config[0].json.parameters.parameters.threshold).to.equal(2);
    });

    it("should build from custom merged task - parent start/end", function(){
        var taskConfig = {
            "freqDist": [
                {
                    "start": 1234,
                    "end": 5678,
                    "target": "fb.parent.author.gender",
                    "threshold": 2,
                    "filter": "links.domain exists",
                    "then": {
                        "target": "fb.parent.author.age",
                        "threshold": 4
                    }
                }
            ]
        };
        var config = taskManager.buildFromConfig(taskConfig);
        expect(config[0].json.start).to.equal(1234);
        expect(config[0].json.end).to.equal(5678);
    });

    it("should build from custom merged task - child start/end", function(){
        var taskConfig = {
            "freqDist": [
                {
                    "target": "fb.parent.author.gender",
                    "threshold": 2,
                    "filter": "links.domain exists",
                    "then": {
                        "start": 1234,
                        "end": 5678,
                        "target": "fb.parent.author.age",
                        "threshold": 4
                    }
                }
            ]
        };
        var config = taskManager.buildFromConfig(taskConfig);
        expect(config[0].then.start).to.equal(1234);
        expect(config[0].then.end).to.equal(5678);
    });
});
