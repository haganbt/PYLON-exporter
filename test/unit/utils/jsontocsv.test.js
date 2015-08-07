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

describe.only("JSON to CSV converter", function(){

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

    it("should return CSV from a single array Of Objects", function(done){
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

    it("should return CSV from a single array Of Objects - redacted", function(done){
        var payload = require("../../support/recipes/response.payloads");
        converter.jsonToCsv(payload.arrayOfObjectsRedacted, function(err, result){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            result.should.be.an('string');
            expect(result).to.eql("redacted");
            done();
        });
    });


    it("should return CSV from a merged object", function(done){
        var payload = require("../../support/recipes/response.payloads");
        converter.jsonToCsv(payload.mergedObject, function(err, result){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            result.should.be.an('string');
            expect(result).to.eql("category,key,interactions,unique_authors\n" +
                "ford,25-34,565400,432800\n" +
                "ford,35-44,464500,372200\n" +
                "honda,25-34,366500,296600\n" +
                "honda,18-24,269700,204200\n");
            done();
        });
    });

    it("should return CSV from a merged object - single object redacted", function(done){
        var payload = require("../../support/recipes/response.payloads");
        converter.jsonToCsv(payload.mergedObjectSingleRedacted, function(err, result){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            result.should.be.an('string');
            expect(result).to.eql("category,key,interactions,unique_authors\n" +
                "ford,redacted\n" +
                "honda,25-34,373700,297900\n" +
                "honda,18-24,273800,205100\n");
            done();
        });
    });

    it("should return CSV from a merged object - double object redacted", function(done){
        var payload = require("../../support/recipes/response.payloads");
        converter.jsonToCsv(payload.mergedObjectDoubleRedacted, function(err, result){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            result.should.be.an('string');
            expect(result).to.eql("category,key,interactions,unique_authors\n" +
                "ford,redacted\nhonda,redacted\n");
            done();
        });
    });

    it("should return CSV from 1 level native nested object", function(done){
        var payload = require("../../support/recipes/response.payloads");
        converter.jsonToCsv(payload.OneLevelNestedObjects, function(err, result){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            result.should.be.an('string');
            expect(result).to.eql("category,key,interactions,unique_authors\n" +
                "BMW,male,3935900,2493500\n" +
                "BMW,female,1801000,1475400\n" +
                "Ford,male,3390100,1733100\n" +
                "Ford,female,1907800,1449800\n" +
                "Honda,female,1014600,844800\n" +
                "Honda,male,931200,639700\n");
            done();
        });
    });

    it("should return CSV from 2 level native nested object", function(done){
        var payload = require("../../support/recipes/response.payloads");
        converter.jsonToCsv(payload.TwoLevelNestedObjects, function(err, result){
            if(err){
                log.error(err);
            }
            should.not.exist(err);
            result.should.be.an('string');
            expect(result).to.eql("category,key,interactions,unique_authors\n" +
                "BMW,male,18-24,1293900,810600\n" +
                "BMW,female,25-34,499700,404400\n" +
                "BMW,female,18-24,420500,323400\n" +
                "Ford,male,25-34,871700,465100\n" +
                "Ford,male,55-64,287000,123900\n" +
                "Ford,male,65+,152300,74500\n" +
                "Ford,female,25-34,415400,330700\n" +
                "Ford,female,35-44,414300,337800\n" +
                "Honda,female,25-34,258100,211500\n" +
                "Honda,female,35-44,212300,164800\n" +
                "Honda,male,25-34,316700,217900\n" +
                "Honda,male,65+,29700,23700\n");
            done();
        });
    });

});




