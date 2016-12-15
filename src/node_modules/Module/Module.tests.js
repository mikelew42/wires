var TestFramework = require("../test/framework");
var test = TestFramework.test;
var is = require("../is");
var $ = require("jquery");
var assert = console.assert.bind(console);

var Module = require("./Module");

$(function(){  // put this in the TestFramework, so you don't always have to do it here...?
// actually - we should be able to run this immediately, have it log immediately, but not display the UI until doc.ready
// that doesn't work for the debug UI (we need to see it as we're running the tests), but it would work fine for the reporting and test selection UI



// We're basically just testing the extend2.subbable implementation
test("Module", function(){

	// which is basically just the recursiveExtend...
	// if we extend->assign an object to  a SubClass, instead of assigning, extend the sub class

	// currently, instantiation of that subclass is entirely up to the parent class
		// could happen in init
		// could happen in an externally-called method
	var check = {};

	var SubSub = Module.extend({
		name: "SubSub",
		init: function(){
			check.subsub = true;
			assert(this.sub instanceof Sub);
			assert(this.sub.mod instanceof Mod);
		}
	});

	var Sub = Module.extend({
		name: "Sub",
		init: function(){
			this.subsub = new this.SubSub({
				sub: this
			});
		},
		SubSub: SubSub
	});

	var Mod = Module.extend({
		name: "Mod",
		init: function(){
			this.sub = new this.Sub({
				mod: this
			});
		},
		Sub: Sub
	});

	var mod = new Mod();

	assert(check.subsub);

	test("extend should auto-extend all SubClasses", function(){
		// this implementation is a little wonky - it actually happens in the elevate method, I think

		var Mod2 = Mod.extend({
			name: "Mod2",
			Sub: {
				prop: 9,
				SubSub: {
					prop: 21
				}
			}
		});

		assert(Mod2.prototype.Sub);
		assert(Mod.prototype.Sub);
		assert(Mod2.prototype.Sub !== Mod.prototype.Sub);

		assert(Mod2.prototype.Sub.isExtensionOf(Mod.prototype.Sub));
		assert(Mod2.isExtensionOf(Mod));

		assert(Mod2.prototype.Sub.prototype.SubSub);
		assert(Mod.prototype.Sub.prototype.SubSub);
		assert(Mod2.prototype.Sub.prototype.SubSub !== Mod.prototype.Sub.prototype.SubSub);

		assert(Mod2.prototype.Sub.prototype.SubSub.isExtensionOf(Mod.prototype.Sub.prototype.SubSub));


		assert(Mod2.prototype.Sub.prototype.prop === 9);
		assert(Mod2.prototype.Sub.prototype.SubSub.prototype.prop === 21);

		var mod2 = new Mod2();
		console.log(mod2);
	});

	var Mod2 = Mod.extend();
});

});