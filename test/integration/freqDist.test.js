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

describe("Frequency Distribution", function() {

    this.timeout(10 * 60 * 1000);

    it("should succeed with a single target config", function(done){
        //var taskConfig = require('../support/recipes/fd.single.target.task');
        var taskConfig1 = {
            "freqDist": [
                {
                    "target": "fb.parent.author.gender",
                    "threshold": 2,
                    "filter": "links.domain exists"
                }
            ]
        };
        var tasks = taskManager.buildFromConfig(taskConfig1);

        oe.process(tasks, function(err, data, task){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            data.should.be.an('array');
            task.should.be.an('object');

            expect(data[0]).to.have.keys(
                "key", "interactions", "unique_authors");
            done();
        });
    });

    it("should merge parent requests, different targets", function(done){
        //var taskConfig2 = require('../support/recipes/fd.merged.parent.task');
        var taskConfig2 = {
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
        var tasks = taskManager.buildFromConfig(taskConfig2);

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

    it("should merge two requests, same targets, different filters", function(done){
        var taskConfig = {
            "freqDist": [
                [
                    {
                        "filter": "links.domain exists",
                        "target": "fb.parent.author.gender",
                        "threshold": 2
                    },
                    {
                        "filter": "not links.domain exists",
                        "target": "fb.parent.author.gender",
                        "threshold": 2
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
                "fb.parent.author.gender", "fb.parent.author.gender_not links.domain exists");
            done();
        });
    });

    it("should merge two requests using the name property", function(done){
        var taskConfig = {
            "freqDist": [
                [
                    {
                        "merge_id": "foo",
                        "filter": "links.domain exists",
                        "target": "fb.parent.author.gender",
                        "threshold": 2
                    },
                    {
                        "merge_id": "bar",
                        "filter": "not links.domain exists",
                        "target": "fb.parent.author.gender",
                        "threshold": 2
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
            expect(data).to.have.keys("foo", "bar");
            done();
        });
    });

    it("should merge a nested request", function(done){
        var taskConfig3 = {
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

        var tasks = taskManager.buildFromConfig(taskConfig3);

        oe.process(tasks, function(err, data, task){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            data.should.be.an('array');
            task.should.be.an('object');
            expect(data[1].key).to.equal("female");
            expect(data[0].key).to.equal("male");
            done();
        });
    });
});
