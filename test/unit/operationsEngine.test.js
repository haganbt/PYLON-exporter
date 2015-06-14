"use strict";
process.env.NODE_ENV = 'test';

var sinon = require("sinon")
    , chai = require("chai")
    , sinonChai = require("sinon-chai")
    ;

var expect = chai.expect
    ;

var OperationsEngine = require('../../lib/OperationsEngine')
    ;

chai.use(sinonChai);

describe("Operations Engine", function(){

    it.skip("can be called", sinon.test(function () {







        var spy = sinon.spy(OperationsEngine);

        //var spy = sinon.spy(object, "method");


        var oe = new OperationsEngine();

        oe.enqueue({});

        expect(spy).to.have.been.calledOnce;
       /*


        var User = require("../../models/User"),
            name = "twitter",
            info = { id: "theid" };

        sinon.spy(User, "findOne");

        registerSocialAccount(name, info);


        expect(User.findOne).to.have.been.calledWith({ "twitter.id": "theid" });
        */
    }));


});
