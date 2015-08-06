"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    , should = chai.should()
    ;

var converter = require("../../../utils/jsonToCsv")
    , log = require('../../../utils/logger')
    ;

describe("JSON to CSV converter", function(){

    it("should return a string", function(done){
        var inObj = [];
        converter.jsonToCsv(inObj, function(err, result){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            result.should.be.an('string');
            done();
        });
    });

    it("should return CSV from array of objects", function(done){
        var payload = require("../../support/recipes/response.payloads");
        converter.jsonToCsv(payload.arrayOfObjects, function(err, result){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            result.should.be.an('string');
            expect(result).to.eql("key,interactions,unique_authors\n" +
                "BMW,4220100,3058300\n" +
                "Ford Motor Company,1259300,720300\n" +
                "Ford Mustang,1167600,699200\n");
            done();
        });
    });

    it("should return CSV from an object with keys", function(done){
        var payload = require("../../support/recipes/response.payloads");
        converter.jsonToCsv(payload.ObjectKeyArrays, function(err, result){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            result.should.be.an('string');
            expect(result).to.eql("name,key,interactions,unique_authors\n" +
                "ford,25-34,565400,432800\n" +
                "ford,35-44,464500,372200\n" +
                "honda,25-34,366500,296600\n" +
                "honda,18-24,269700,204200\n");
            done();
        });
    });

});




