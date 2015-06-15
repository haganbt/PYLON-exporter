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

describe("Frequency distribution", function() {

    this.timeout(10 * 60 * 1000);

    it("should succeed with a single target config", function(done){
        var config = taskManager.getDefaultTaskObj()
            , reqConfig = {
                    "target": "fb.parent.author.gender",
                    "threshold": 2
                }
            ;

        config.json.parameters.parameters = reqConfig;

        oe.process(config, function(err, data, task){
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

});
