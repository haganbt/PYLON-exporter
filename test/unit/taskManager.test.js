"use strict";

var chai = require("chai")
    , taskManager = require("../../lib/taskManager")
    ;

var expect = chai.expect
    ;

describe("Task Manager", function(){

    it("should successfully build response function", function(){
        var ops = { "foo": "bar" };
        var test = taskManager.buildRequestFunctions(ops);
        expect(test).to.be.instanceof(Array);
    });

});
