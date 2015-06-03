"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var operator = require("../../../utils/operator")
    ;

describe("Operator lookup", function(){

    it("should return the default for an invalid target ", function(){
        var testOp = operator.get("foo");
        expect(testOp).to.equal("==");
    });

    it("should return operator for a valid target ", function(){
        var testOp = operator.get("fb.content");
        expect(testOp).to.equal("any");
    });

});
