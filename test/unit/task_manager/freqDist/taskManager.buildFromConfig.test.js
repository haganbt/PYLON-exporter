"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var taskManager = require('../../../../lib/taskManager')
    ;

describe("Task Manager buildFromConfig - freqDist", function(){

    it("should build from - single target task", function(){

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
            .to.have.keys("hash", "filter", "start", "end", "parameters");

        expect(config[0].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[0].json.parameters.analysis_type).to.equal("freqDist");
        expect(config[0].json.parameters.parameters.target)
            .to.equal("fb.parent.author.gender");

        expect(config[0].json.parameters.parameters.threshold).to.equal(2);
    });

    it("should build from - 2 targets merged", function(){

        var taskConfig = {
            "freqDist": [
                [
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
            ]
        };

        var config = taskManager.buildFromConfig(taskConfig);

        config.should.be.an('array');
        expect(config).to.have.length(2);

        expect(config[0].json)
            .to.have.keys("hash", "filter", "start", "end", "parameters");

        expect(config[0].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[0].json.parameters.analysis_type).to.equal("freqDist");
        expect(config[0].json.filter).to.equal("links.domain exists");
        expect(config[0].json.parameters.parameters.target)
            .to.equal("fb.parent.author.gender");

        expect(config[0].json.parameters.parameters.threshold).to.equal(3);


        expect(config[1].json)
            .to.have.keys("hash", "filter", "start", "end", "parameters");

        expect(config[1].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[1].json.parameters.analysis_type).to.equal("freqDist");
        expect(config[1].json.filter).to.equal("not links.domain exists");
        expect(config[1].json.parameters.parameters.target)
            .to.equal("fb.parent.author.age");

        expect(config[1].json.parameters.parameters.threshold).to.equal(5);


    });

    it("should build from - merged child", function(){

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
            .to.have.keys("hash", "filter", "start", "end", "parameters");

        expect(config[0].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[0].json.parameters.analysis_type).to.equal("freqDist");
        expect(config[0].json.filter).to.equal("links.domain exists");
        expect(config[0].json.parameters.parameters.target)
            .to.equal("fb.parent.author.gender");

        expect(config[0].json.parameters.parameters.threshold).to.equal(2);
    });

    it("should return empty when duplicate targets used", function(){
        var taskConfig = {
            "freqDist": [
                [
                    {
                        "target": "fb.parent.author.gender",
                        "threshold": 2
                    },
                    {
                        "target": "fb.parent.author.gender",
                        "threshold": 2
                    }
                ]
            ]
        };
        var config = taskManager.buildFromConfig(taskConfig);
        config.should.be.an('array');
        expect(config).to.have.length(0);
    });

    it("should use a name if specified.", function(){
        var taskConfig = {
            "freqDist": [
                [
                    {
                        "merge_id": "foo",
                        "target": "fb.parent.author.gender",
                        "threshold": 2
                    },
                    {
                        "merge_id": "bar",
                        "target": "fb.parent.author.gender",
                        "threshold": 2
                    }
                ]
            ]
        };
        var config = taskManager.buildFromConfig(taskConfig);
        config.should.be.an('array');
        expect(config[0].cache.mergeKey).to.equal("foo");
        expect(config[1].cache.mergeKey).to.equal("bar");
    });
});
