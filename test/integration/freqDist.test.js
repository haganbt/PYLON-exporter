"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    , should = chai.should()
    ;

var OperationsEngine = require('../../lib/OperationsEngine')
    , taskManager = require('../../lib/taskManager')
    , log = require('../../utils/logger')
    ;

var oe = new OperationsEngine();

describe.skip("Frequency Distribution", function() {

    this.timeout(10 * 60 * 1000);

    it("should succeed with a single target config", function(done){
        //var taskConfig = require('../support/recipes/fd.single.target.task');
        var taskConfig = {
            "freqDist": [
                {
                    "target": "fb.parent.author.gender",
                    "threshold": 2,
                    "filter": "links.domain exists"
                }
            ]
        };
        var tasks = taskManager.buildFromConfig(taskConfig);

        oe.process(tasks, function(err, data, task){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            data.should.be.an('object');
            task.should.be.an('object');
            expect(data.analysis).to.have.keys(
                "analysis_type", "parameters", "results", "redacted");
            done();
        });
    });

    it("should merge two parent requests", function(done){
        //var taskConfig2 = require('../support/recipes/fd.merged.parent.task');
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
        var tasks = taskManager.buildFromConfig(taskConfig);

        oe.process(tasks, function(err, data, task){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            data.should.be.an('object');
            task.should.be.an('object');

            expect(data).to.have.keys(
                "fb.parent.author.gender", "fb.parent.author.age");
            done();
        });
    });

    it("should merge a nested request", function(done){
        //var taskConfig = require('../support/recipes/fd.merged.child.task');
        var taskConfig = {
            "freqDist": [
                {
                    "target": "fb.parent.author.gender",
                    "threshold": 2,
                    "then": {
                        "target": "fb.parent.author.age",
                        "threshold": 4
                    }
                }
            ]
        };

        var tasks = taskManager.buildFromConfig(taskConfig);

        oe.process(tasks, function(err, data, task){
            if(err){
                log.error(err);
            }
            console.log(data);

            should.not.exist(err);
            data.should.be.an('object');
            data.analysis.results.should.be.an('array');
            task.should.be.an('object');
            expect(data.analysis.results).to.have.keys("male", "female");
            done();
        });
    });
});
