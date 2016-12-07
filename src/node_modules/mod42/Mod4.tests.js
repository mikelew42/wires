var test = require("test42");
var view = require("View");
var is = require("is");
var Mod = require("./Mod4");
var assert = test.assert;

// view.p("TODO: most bgs should be relatively transparent, and just lighten/darken the root element's bg by a little");

// view.p("TODO: fix up the test reporting UI, so its more like a footer")

// view.p("TODO: don't auto-exec tests.  Manually exec the root test at the app level?  Collect pass/fail numbers from all tests, even if you're running many .test.js files.")

test("Mod4", function(){

	view.p("TODO: Import and run some standard tests.");

	test("auto adopt", function(){
		var mod = Mod({
			sub: Mod()
		});

		assert(mod.sub.parent === mod);
	});

	test("only adopt once", function(){
		var sub = Mod();

		assert(!sub.parent);
		assert(sub.name === "mod4");

		var mod1 = Mod({
			first: sub
		});

		assert(mod1.first === sub);
		assert(mod1.first.name === "first");
		assert(sub.name === "first");
		assert(sub.parent === mod1);

		var mod2 = Mod({
			second: sub
		});

		assert(mod2.second === sub);
		assert(sub.name === "first");
		assert(sub.parent === mod1);
	});

	test("add prototype sub module, and protect -> auto clone on instantiate", function(){
		var sub = Mod();

		assert(is.undef(sub.parent));

		var Mod2 = Mod.extend({
			sub: sub
		});

		assert(Mod2.prototype.sub.parent === Mod2.prototype);
		assert(Mod2.prototype.sub.name === "sub");

		var mod = Mod2();

		assert(mod.hasOwnProperty("sub"));
		assert(mod.sub.parent === mod);
		assert(mod.sub.name === "sub");
		assert(mod.sub !== Mod2.prototype.sub);

		var mod2 = Mod2();

		assert(mod2.hasOwnProperty("sub"));
		assert(mod2.sub.parent === mod2);
		assert(mod2.sub.name === "sub");
		assert(mod2.sub !== mod.sub);

		var Mod3 = Mod.extend({
			another: sub
		});

		assert(Mod3.prototype.another.parent === Mod2.prototype);
		assert(Mod3.prototype.another.name === "sub");

	});

	test("recursive cloning", function(){
		var sub1 = Mod({
			sub2: Mod()
		});

		var mod = Mod({
			sub1: Mod({
				sub2: Mod()
			})
		});

		console.log(mod);

		var mod2 = mod.clone();

		console.log(mod2);

		assert(mod2.sub1.sub2 !== mod.sub1.sub2);
	});
});


// test("nested", function(){
// 	// var sub = Mod({})
// });