"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var taskManager = require('../../lib/taskManager')
    ;

describe("Task Manager", function(){

    it("should create a default task object", function(){
        var taskObj = taskManager.getDefaultTaskObj();
        expect(taskObj).to.be.an.object;
        expect(taskObj).to.have.keys("auth", "json", "method", "uri");
    });

    it("should build tasks from the config file", function(){
        var tasks = taskManager.buildFromConfig();
        expect(tasks).to.be.an.array;
    });

    it.skip("should build a task object from a response", function(){
        //todo
    });

});
