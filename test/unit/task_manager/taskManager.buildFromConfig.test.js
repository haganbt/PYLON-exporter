"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var taskManager = require('../../../lib/taskManager')
    ;

describe.only("Task Manager buildFromConfig", function(){

    it("should build a valid task object - single target task", function(){

        var taskConfig = require('../../support/recipes/fd.single.target.task');
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

    it("should build a valid task object - 2 targets merged", function(){

        var taskConfig = require('../../support/recipes/fd.merged.parent.task');
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

        expect(config[0].json.parameters.parameters.threshold).to.equal(2);


        expect(config[1].json)
            .to.have.keys("hash", "filter", "start", "end", "parameters");

        expect(config[1].json.parameters)
            .to.have.keys("analysis_type", "parameters");

        expect(config[1].json.parameters.analysis_type).to.equal("freqDist");
        expect(config[1].json.filter).to.equal("not links.domain exists");
        expect(config[1].json.parameters.parameters.target)
            .to.equal("fb.parent.author.age");

        expect(config[1].json.parameters.parameters.threshold).to.equal(2);


    });

    it("should build a valid task object - merged child", function(){

        var taskConfig = require('../../support/recipes/fd.merged.child.task');
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

});
