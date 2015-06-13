"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var OperationsEngine = require('../../lib/OperationsEngine')
    , taskManager = require('../../lib/taskManager')
    ;

var oe = new OperationsEngine();

describe("A frequency distribution", function() {

    this.timeout(10 * 60 * 1000);

    it.only("with a single target should succeed", function(done){
        var config = taskManager.getDefaultTaskObj();

        oe.process(config, function(err, data, task){
            if(err){
                log.error(err);
            }
            expect(data).to.exist;
            expect(task).to.exist;

            console.log(data);
            done();

        });
            /*
            should.not.exist(err);
            res.status.should.eql(201);
            should.exist(res.body.location);
            should.exist(res.body.rating);


            if(err){
                log.error(err);
            } else {
                console.log("\n");
                log.info("REQUEST ::: " + JSON.stringify(task.json));
                log.info("RESPONSE ::: " + JSON.stringify(data));


            }
            */

        //expect(taskObj).to.be.an.object;
        //expect(taskObj).to.have.keys("auth", "json", "method", "uri");
    });

});