"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    , should = chai.should()
    ;

var OperationsEngine = require('../../lib/OperationsEngine')
    , taskManager = require('../../lib/taskManager')
    , log = require('../../utils/logger/index')
    ;

var oe = new OperationsEngine();

describe.skip("Time Series", function() {

    this.timeout(10 * 60 * 1000);

    it("should succeed with a single target config", function(done){
        var taskConfig = {
            "timeSeries": [
                {
                    "filter": "fb.content exists",
                    "interval": "week",
                    "span": 1
                }
            ]
        };
        var tasks = taskManager.buildFromConfig(taskConfig);

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

    it("should merge two parent requests, using the id", function(done){
        var taskConfig = {
            "timeSeries": [
                [
                    {
                        "id": "foo",
                        "filter": "fb.content contains \"ford\"",
                        "interval": "week",
                        "span": 1
                    },
                    {
                        "id": "bar",
                        "filter": "fb.content contains \"honda\"",
                        "interval": "week",
                        "span": 1
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
            data.should.be.an('array');
            task.should.be.an('object');
            expect(data).to.have.keys("foo", "bar");
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
            should.not.exist(err);
            data.should.be.an('array');
            task.should.be.an('object');
            expect(data[0].key).to.equal("male");
            expect(data[1].key).to.equal("female");
            done();
        });
    });

    it("should merge two parent requests, using the filter", function(done){
        var taskConfig = {
            "timeSeries": [
                [
                    {
                        "filter": "fb.content contains \"ford\"",
                        "interval": "week",
                        "span": 1
                    },
                    {
                        "filter": "fb.content contains \"honda\"",
                        "interval": "week",
                        "span": 1
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
                "fb.content contains \"ford\"",
                "fb.content contains \"honda\"");
            done();
        });
    });
});
