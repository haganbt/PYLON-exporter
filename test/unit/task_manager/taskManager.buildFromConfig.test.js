"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var taskManager = require('../../../lib/taskManager')
    ;

describe("Task Manager buildFromConfig", function(){

    it("should build tasks from the config file", function(){
        var tasks = taskManager.buildFromConfig();
        tasks.should.be.an('array');
    });

});
