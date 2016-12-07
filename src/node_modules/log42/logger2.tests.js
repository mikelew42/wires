// var TestFramework = require("test/framework");
// var test = TestFramework.test;
var test = require("test42");
var is = require("is");
var $ = require("jquery");
var assert = console.assert.bind(console);

var logger = require("log42/logger2");

// var Mod1 = require("mod42/Mod1");
var Mod2 = require("mod42/Mod2");

test("logger", function(){

	test("auto", function(){
		var log = logger();
		log("auto defaults to off");
		assert(is.undef(log.value));
	});

	test("on", function(){
		var log = logger(true);
		log("use true to turn it on");
	});

	test("off", function(){
		var log = logger(false);
		log("will not log, even if global logging is turned on");
		log("why? its not meant to stay off forever - its so you can turn it back on easily");
	});

	test("default off", function(){
		var log = logger();

		console.group("assert: empty group");
		log("shouldn't show");
		log.error("uh oh");
		log("hello world");
		log.trace("here's a trace");
		log.debug("here's a debug");
		log.info("here's some info");
		log.warn("here's a warning");
		log.error("here's an error");
		console.groupEnd();

		log.on(function(log){
			log.g("assert: sample of all logs", function(){
				log("hello world");
				log.trace("here's a trace");
				log.debug("here's a debug");
				log.info("here's some info");
				log.warn("here's a warning");
				log.error("here's an error");
			});
		});

		log("goodbye world");
		log.error("uh oh - this shouldn't appear");

		log = logger(true);

		log("hello again");
		log.warn("warning!");

		log.g("nested scope", function(){
			console.log("damnit");
			var log = logger(false);

			log("just turned off for this function scope");
			log.error("shouldn't show");
			log.info("this is very bad, you shouldn't see me");
		});

		log("hello again!");
		log.info("now that we've exited the function scope, these should be turned on again");

		test("tests are different from log groups", function(){
			log("I think I'm turned on");
			log("This should have its own 'nested scope' log group inside");
		});

		test("no, that was the first child... now we should have a second run", function(){
			log("Now we should have a second run...");
		});
	});	

	test("modular", function(){
		console.log("starting modular");
		var obj = {};
		logger.install(obj);

		console.log(obj.log.enabled);

		test("basic", function(){
			console.group("basic");
			console.log(obj.log.enabled);
			obj.log("yo");

			console.log("turning obj.log = true");
			obj.log = true;

			obj.log("now we're on");
			console.groupEnd();
		});

		test("override", function(){
			console.log("starting override");
			console.log(obj.log.enabled);
			var log = logger();

			obj.log("wtf");
			obj.log.error("nope");

			log.on(function(){
				obj.log("I should be on");
			});

			obj.log.error("nope");
		});

	});

});

test("overrides", function(){
	var alog = logger();
	var log = logger(true);
	var xlog = logger(false);

	this.assert(alog.auto);
	this.assert(log.value);
	this.assert(!xlog.value);

	alog.on(function(){
		var alog2 = logger();
		this.assert(alog2.auto);
		this.assert(alog2.enabled);
	}, this);

	this.assert(false);
});

test("mod2 overrides", function(){
	var mod = Mod2({
		log: true,
		myMethod: function(){
			console.log("myMethod");
			mod2.method2();
		}
	});

	var mod2 = Mod2({
		method2: function(){
			console.log("method2");
			this.log("inside method2");
		}
	});

	mod.myMethod();
	mod2.method2();
});

// normally, turning log: true for any Mod2 object should force logging for any method within
test("per method", function(){
	logger.on(function(){
		// create an instance
		var mod = Mod2();
	});

	// vs

	var mod = Mod2({
		log: true
	});
	

	// as long as everything you're doing is contained within the instance methods, then setting log: true is the same as wrapping in an override closure

	// also, per method logging:

	var mod = Mod2({
		log: true // by default, all methods are turned on
	});

	// vs

	var mod = Mod2({
		methods: {
			methodName: {
				log: true
			}
		}
	}); // should turn logging on only for that method

	// you could even map those automatically:

	var mod = Mod2({
		existingMethod: {
			log: true
		}
	}); // if the method is wrapped.. or even if its not...? 

	// but how do you create a logged method if it doesn't exist?
	// this could also be the way to only wrap a few methods, and do so more selectively/manually
	var Method = function(){};
	var mod = Mod2({
		newMethod: Method({
			log: true,
			method: function(){}
		})
	});

});

test("wtf", function(){
	var obj = {};
	obj.id = Date.now();
	console.log(obj.id);

	test("and then", function(){
		console.log("and then");
		console.log(obj.id);
	});

	console.log(obj.id);

	test("and another", function(){
		console.log("and another");
		console.log(obj.id);
	});

	console.log(obj.id);
});

test("omg", function(){
	var root = function(sub){
		var obj = {};
		obj.id = 0;
		
		if (sub === 1)
			obj.id = 1;

		console.log(obj.id);

		if (sub === 1){
			(function(){
				console.log(obj.id);
			})();
		}

		if (sub === 2){
			(function(){
				console.log(obj.id);
			})();
		}
	};

	root(1);
	root(2);
});