var test = require("test42");
var is = require("is");
var $ = require("jquery");
var assert = console.assert.bind(console);

var logger = require("log42");

var Mod1 = require("mod42/Mod1");
var Mod2 = require("mod42/Mod2");

console.groupEnd();

test("Mod1", function(){
	test("basic", function(){
		var mod = Mod1({name: "test_Mod1_basic_mod" });
		assert(mod instanceof Mod1);
		assert(mod.constructor === Mod1);
		console.dir(Mod1);
		console.log(mod);
		mod.log("hello");
	});

	test("instantiate overriding", function(){
		var mod = Mod1({
			name: "test_Mod1_instantiate_mod",
			instantiate: function(){
				// should not run... instantiate cannot be overridden per instance
				assert(false);
			}
		});

		var check = {};

		var Mod2 = Mod1.extend({
			name: "test_Mod1_instantiate_Mod2",
			instantiate: function(){
				check.instantiate = true;
			}
		});

		var mod2 = Mod2();

		assert(check.instantiate === true);
	});

	test("create, assign, init", function(){
		var check = {},
			mod = Mod1({
				init: function(){
					check.init = true;
				},
				prop: 123
			});

		assert(check.init);
		assert(mod.prop === 123);
	});

	test("extend", function(){

		test("one", function(){
			var Mod2 = Mod1.extend();

			assert(Mod2.base === Mod1);

			var mod2 = Mod2();
			assert(mod2 instanceof Mod2);
			assert(mod2 instanceof Mod1);
		});

		test("two", function(){
			var check = {},
				Mod2 = Mod1.extend({
					name: "Mod2",
					prop: 123,
					init: function(){
						check.init = true;
					}
				}, {
					prop: 456
				});

			assert(Mod2.name === "Mod2");
			assert(!check.init);
			assert(Mod2.prototype.prop === 456);

			var mod2 = new Mod2({
				prop: 678
			});

			assert(mod2.name === "mod2");
			assert(check.init);
			assert(mod2.prop === 678);
			assert(mod2.proto.prop === 456);
			assert(!mod2.base.prop);

			var Mod3 = Mod2.extend({
				prop: 789
			});
			var mod3 = new Mod3({
				prop: 234
			});

			assert(mod3.prop === 234);
			assert(mod3.proto.prop === 789);
			assert(mod3.base.prop === 456);
		});

		test("three", function(){
			var check = {},
				Mod2 = Mod1.extend({
					set: {
						main: function(){
							check.set = true;
						}
					}
				});

			assert(!check.set);
			Mod2.prototype.set();
			assert(check.set);
			assert(Mod2.prototype.set !== Mod1.prototype.set);
		});

		test("set", function(){

		});
	});

	test("logger", function(){
		var mod = Mod1({
			log: true
		});

		mod.log("hello");
		// mod.log.info("info");
		// mod.log.debug("debug");
		// mod.log.warn("warn");
		// mod.log.error("error");
		// mod.log.group("group");
		// mod.log.log("log.log");
		// mod.log.end();

		mod.log = false;
		mod.log.warn("this should not be");
		
		var Mod2 = Mod1.extend({
			log: true
		});
		var mod2 = Mod2();

		mod2.log("this should be on");

		var Mod3 = Mod1.extend({
			log: false,
			method: function(){
				this.log.error("oh shit");
				this.log = true;
				this.log("ok, we're good");
			}
		});

		var mod3 = Mod3();
		mod3.method();

	});

	test("pass log down from above", function(){
		var mod1 = Mod1({
			log: true
		});

		var mod2 = Mod1({
			log: mod1.log
		});

		mod2.log("I should be on");

		var mod3 = Mod1();
		var mod4 = Mod1({
			log: mod3.log
		});

		mod4.log.error("I should not be on");
	});

	test("auto extend of sub classes", function(){
		var Parent = Mod1.extend({
			Child: Mod1.extend({
				prop1: 1,
				prop2: true
			})
		});

		assert(Parent.prototype.Child.prototype.prop1 === 1);

		var parent = new Parent({
			Child: {
				prop3: "three"
			}
		});

		assert(Parent.prototype.Child !== parent.Child);
		assert(is.undef(Parent.prototype.Child.prototype.prop3));
		assert(parent.Child.prototype.prop1 === 1);
		assert(parent.Child.prototype.prop3 === "three");
	});

	test("deep extend of objects", function(){
		var Mod2 = Mod1.extend({
			settings: {
				one: 1,
				sub: {
					three: "three"
				}
			}
		});

		assert(Mod2.prototype.settings.one === 1);

		var mod1 = Mod2({
			settings: {
				two: true,
				sub: {
					four: 4
				}
			}
		});

		assert(mod1.settings !== Mod2.prototype.settings);
		assert(mod1.settings.one === 1);
		assert(mod1.settings.two === true);
		assert(mod1.settings.sub.three === "three");
		assert(mod1.settings.sub.four === 4);
		assert(mod1.settings.sub !== Mod2.prototype.settings.sub);
	});

});

test("Mod2", function(){

	test("basic", function(){
		var mod = Mod2();
	});

	test("logging", function(){
		// logger.on();
		var mod = Mod2({
			log: true,
			init: function(){
				this.log("yep");

				this.log("yerp");

				this.autoWrap();
			},
			autoWrap: function(){
				this.log("inside autoWrap");
			}
		});
		// console.log(mod.set.mfn.id)
	});

	test("extending", function(){
		var Mod3 = Mod2.extend({
			// log: true,
			methods: {
				instantiate: {
					expand: false
				},
				test: {
					expand: false
				}
			},
			init: function(){
				this.log("hello world");
			},
			test: function(){
				this.log("i'm wrapped!!");
			}
		});

		var mod = Mod3({
			log: true
		});
		mod.test();

	});
});