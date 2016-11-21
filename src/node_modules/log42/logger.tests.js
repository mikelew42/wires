var TestFramework = require("test/framework");
var test = TestFramework.test;
var is = require("is");
var $ = require("jquery");
var assert = console.assert.bind(console);

var logger = require("log42/logger");

$(function(){

test("logger", function(){

	test("default on", function(){
		var log = logger();

		log("hello world");
		log.info("here's some info");

		log = logger(false);

		log("goodbye world");
		log.error("uh oh - this shouldn't appear");

		log = logger();

		log("hello again");
		log.warn("warning!");

		test("nested scope", function(){
			var log = logger(false);

			log("just turned off for this function scope");
			log.error("shouldn't show");
			log.info("this is very bad, you shouldn't see me");
		});

		log("hello again!");
		log.info("now that we've exited the function scope, these should be turned on again");
	});

	test("default off", function(){
		var log = logger(false);

		log("shouldn't show");

		log = logger();
		log("this should show");

		log = logger(false);
		log("and hidden again");

		test("nested scope", function(){
			var log = logger();

			log("in here, we have a different scope");
		});

		log("and back out here, we're hidden");
	})

});

});