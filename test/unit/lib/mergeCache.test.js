"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var mergeCache = require('../../../lib/mergeCache')
    ;

describe("Merge Cache", function(){

    it("should return a UIID when setting", function(){
        var id = mergeCache.create();
        expect(id.should.be.a('string'));
        expect(id.should.have.length(36));
    });

    it("should increment the taskCount when adding a key", function(){
        //todo
    });

    it("should decrement the taskCount when adding data", function(){
        //todo
    });

});
