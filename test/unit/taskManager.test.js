"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

describe.skip("Task Manager", function(){

    it("test", function(){
        var ops = { "foo": "bar" };
        expect(ops).to.exist;
    });

});
