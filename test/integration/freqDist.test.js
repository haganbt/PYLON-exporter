"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var OperationsEngine = require('../../lib/OperationsEngine');

var oe = new OperationsEngine();

describe("A frequency distribution ", function() {

    this.timeout(10 * 60 * 1000);

    it.skip("with a single target should succeed", function(){
        var config = {
            "app": {
                "max_parallel_tasks": 3
            },
            "hash": "b5566a154bb6dcd19b52b3b431e59373",
            "auth": {
                "username": "CS_2",
                "api_key": "5c15152f7086f7f3b2d2cc6b25648e94"
            },
             "analysis": {
             "freqDist": [
                 {
                 "target": "fb.parent.author.gender",
                 "threshold": 2
                 }
             ]
             }
        };

        oe.process(config, function(err, data, task){
            if(err){
                log.error(err);
            }
            expect(data).to.exist;
            expect(task).to.exist;
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