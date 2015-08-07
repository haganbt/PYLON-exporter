"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var taskManager = require('../../../../lib/taskManager')
    ;

describe("Task Manager", function(){

    it("should create a default task object", function(){
        var taskObj = taskManager.getDefaultTaskObj();
        taskObj.should.be.an('object');
        expect(taskObj).to.have.keys("auth", "json", "method", "uri");
    });

});
