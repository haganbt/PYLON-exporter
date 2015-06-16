"use strict";
process.env.NODE_ENV = 'test';

var chai = require("chai")
    ;

var expect = chai.expect
    ;

var mergeCache = require('../../lib/mergeCache')
    ;

describe("Merge Cache", function(){

    it("should return a UIID when setting", function(){
        var id = mergeCache.create();

        expect(id.should.be.a('string'));
        expect(id.should.have.length(36));
    });

    it("GET should return the default cache object", function(){
        var id = mergeCache.create();
        var cacheObj = mergeCache.get(id);

        expect(cacheObj.should.be.an('object'));
        expect(cacheObj).to.have.keys("remainingTasks");
        expect(cacheObj.remainingTasks.should.equal(0));
    });

    it("should add a key", function(){
        var id = mergeCache.create();
        mergeCache.add(id, "foo");
        var cacheObj = mergeCache.get(id);

        expect(cacheObj).to.have.keys("foo", "remainingTasks");
    });

    it("should add a value for a given key", function(){
        var id = mergeCache.create();
        //must add the key before the value
        mergeCache.add(id, "bar");
        mergeCache.add(id, "bar", {"baz": 123});
        var cacheObj = mergeCache.get(id);

        expect(cacheObj).to.have.keys("bar", "remainingTasks");
        expect(cacheObj.bar).to.have.keys("baz");
        expect(cacheObj.bar.baz.should.equal(123));
    });

    it("should increment the remainingTasks when adding a key", function(){
        var id = mergeCache.create();
        mergeCache.add(id, "foo");
        var cacheObj = mergeCache.get(id);

        expect(cacheObj.remainingTasks.should.equal(1));
    });

    it("should decrement the remainingTasks when adding data", function(){
        var id = mergeCache.create();
        mergeCache.add(id, "foo");
        mergeCache.add(id, "foo", {"baz": 123});
        var cacheObj = mergeCache.get(id);

        expect(cacheObj.remainingTasks.should.equal(0));
    });

});
