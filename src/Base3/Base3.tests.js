var TestFramework = require("../test/framework");
var test = TestFramework.test;
var Base3 = require("./Base3");
var is = require("../is");
var $ = require("jquery");
var assert = console.assert.bind(console);

var Set = require("./Set");

$(function(){

test("Base3", function(){

	// it would be nice to be able to run all Base2 tests automatically, instead of copying them all...

	test("standard methods", function(){
		assert(is.fn(Base3.assign));
		assert(is.fn(Base3.extend));
		assert(is.fn(Base3.isExtensionOf));
		assert(is.fn(Base3.prototype.assign));
		assert(is.fn(Base3.prototype.create));
		assert(is.fn(Base3.prototype.init));
	});

	test("clean instance", function(){
		var base = new Base3();
		// console.log(base.id);
		// and test w/o "new"?


		test("instanceof and .constructor", function(){
			assert(base instanceof Base3);
			assert(base.constructor === Base3);
		});

		test("track", function(){
			assert(is.num(base.id));
			assert(is.num(Base3.id));
			assert(is.num(Base3.prototype.id));
			assert(base.id !== Base3.prototype.id);
			assert(Base3.id !== Base3.prototype.id);
		});

		test("assign", function(){
			test("single assign", function(){
				base.assign({
					prop: 123
				});

				assert(base.prop === 123);
			});

			test("multiple assigns", function(){
				base.assign({
					prop: 1
				}, {
					prop: 2,
					another: 3
				}, {
					prop: 4,
					another: 5,
					third: 6
				});

				assert(base.prop === 4);
				assert(base.another == 5);
				assert(base.third === 6);
			});
		});
	});

	test("create, assign, init", function(){
		var check = {}, 
			base = Base3({
				prop: 5,
				init: function(){
					check.init = true;
				}
			});

		assert(base.prop === 5);
		assert(check.init);
	});

	// ExtendModFn
	test("extend", function(){

		test("clean extend", function(){
			var Base4 = Base3.extend();

			test("isExtensionOf", function(){
				assert(Base4.isExtensionOf(Base3));
			});

			test(".base", function(){
				assert(Base4.base === Base3);
			});

			test("standard methods", function(){
				assert(is.fn(Base4.assign));
				assert(is.fn(Base4.extend));
				assert(is.fn(Base4.isExtensionOf));
				assert(is.fn(Base4.prototype.assign));
				assert(is.fn(Base4.prototype.create));
				assert(is.fn(Base4.prototype.init));
			});

			test("instance", function(){
				var base = new Base4();

				assert(base instanceof Base4);
				assert(base instanceof Base3);
				assert(base.constructor === Base4);
	
				test("track", function(){
					assert(is.num(base.id));
					assert(is.num(Base4.id));
					assert(is.num(Base4.prototype.id));
					assert(base.id !== Base4.prototype.id);
					assert(Base4.id !== Base4.prototype.id);
				});
			});
		});

		test("with name", function(){
			var Base4 = Base3.extend({
				name: "Base4"
			});

			assert(Base4.name === "Base4");
			assert(Base3.name !== "Base4");
		});

		test("with props", function(){
			var check = {};
			var Base4 = Base3.extend({
				name: "Base4",
				prop: 123,
				init: function(){
					check.init = true;
				}
			}, {
				prop: 456
			});


			assert(!check.init);
			assert(Base4.prototype.prop === 456);

			var base = new Base4();
			assert(check.init);
		});

		test("recursiveExtend", function(){
			var check = {};
			var Base4 = Base3.extend({
				Sub: Base3.extend({
					prop: 5
				})
			});

			assert(Base4.prototype.Sub.isExtensionOf(Base3));

			var base = Base4();

			assert(base.sub instanceof Base3);
			assert(base.sub.prop === 5);

			// extend.protectPrototype
			var Base5 = Base4.extend();
			assert(Base5.prototype.Sub.isExtensionOf(Base4.prototype.Sub));
			var base5 = Base5();
			assert(base5.sub.prop === 5);

			// extend.recursiveExtend
			var Base6 = Base4.extend({
				Sub: {
					prop: 6
				}
			});
			assert(Base6.prototype.Sub.isExtensionOf(Base4.prototype.Sub));
			var base6 = Base6();
			assert(base6.sub.prop === 6);
		});
	});

	test(".set", function(){

		test("basic", function(){

			var base = Base3({
				test: function(){
					check.args= arguments;
				}
			}), check = {};

			test("value", function(){
				base.set({
					test: 1
				});

				assert(check.args[0] === 1)
				assert(check.args.length === 1)
			});

			test("array", function(){
				base.set({
					test: [1, 2, 3]
				});

				assert(check.args[0] === 1)
				assert(check.args[1] === 2)
				assert(check.args[2] === 3)
				assert(check.args.length === 3);
			});

			test("sub", function(){
				base.assign({
					sub: {
						set: function(){
							check.args = arguments;
						}
					}
				});

				test("value", function(){
					base.set({
						sub: 1
					});

					assert(check.args[0] === 1)
					assert(check.args.length === 1)
				});
			});		
		});
	
		test("extend", function(){
			var Base4 = Base3.extend({
				set: {
					arg: function(mod, arg){
						check.args.push(arg);
					}
				}
			}), check = { args: [] };

			var base = new Base4();

			base.set(1, 2, 3, 4);

			assert(check.args.length === 4);
			assert(check.args[0] === 1);
			assert(check.args[1] === 2);
			assert(check.args[2] === 3);
			assert(check.args[3] === 4);
		});

		test("uses .set on extend?", function(){
			var Base4 = Base3.extend({
				test: function(arg){
					check.arg = arg
				}
			}), check = {};

			assert(is.fn(Base4.prototype.test));

			var Base5 = Base4.extend({
				test: 1
			});

			assert(check.arg === 1);

		});
	});

	test("events", function(){

		var Base4 = Base3.extend({

		}), check = { count: 0 };

		Base4.on("something", function(){
			check.count++;
		});

		assert(check.count === 0);
		Base4.emit("something");
		assert(check.count === 1);

		// delete all events on .extend
		var Base5 = Base4.extend();

		Base5.emit("something");
		assert(check.count === 1);
	});

	test("default new event", function(){
		var Base4 = Base3.extend({
			name: "Base4"
		}), check = {};
		Base4.on("new", function(base){
			check.base = base;
		});
		var base = new Base4();
		assert(check.base === base);
	});

	test("inst", function(){
		var Base4 = Base3.extend({
			Sub: Base3.extend({
				name: "Sub",
				prop: 5
			}).assign({
				setup: function(parent){
					// this === Sub
					parent.sub = new this();
				}
			})
		});

		var base = new Base4();

		assert(base.sub instanceof base.Sub);
	});

	test("setup", function(){
		// setup only runs when called from a parent... if the class hasn't been added to a parent, then it wouldn't run..

		var Base4 = Base3.extend({
			name: "Base4"
		});

		var Base5 = Base3.extend({
			name: "Base5",
			Base4: Base4
		});			

		test("auto", function(){		
			var base = new Base5();
			assert(base.base4 instanceof Base4);
		});

		test("bypass", function(){
			Base4.setup = false;
			var base = new Base5();
			assert(is.undef(base.base4));
		});

	});

	test("Property", function(){
/*
We won't always use Property as a Module.prototype.Property sub class that gets auto instantiated...

Sometimes we'll want to use Property in a quick/informal way.

In fact, I'll probably just auto-upgrade all properties...?

Anyway - we need a hook to run once the parent has been assigned.

How about... install?
*/

// It's really important to protect the Base.prototype, and re-instantiate these properties.  If not, changing the property value will change the base class.
	// I have yet to rewrite the recursive extend, where that might take place...
		var Property = Base3.extend({
			value: undefined, // <--- this is where the value is stored
			init: function(){
				if (this.parent)
					this.install();
			},
			install: function(){
				// if each prototype gets a new instance (we're not trying to share these properties all the way down the food-chain, like normal props?)
					// no, I don't think that's smart
					// so, in some rare instances, when you're trying to use that fallback feature to return a property to its default,
					// these props will work slightly different to normal props
					// if you absolutely need that feature, you would have to rewrite this...
				var prop = this;
				Object.defineProperty(this.parent, this.name, {
					get: function(){
						return prop.getter();
					},
					set: function(value){
						prop.setter(value);
					}
				});

				this.parent.props = this.parent.props || {};
				this.parent.props[this.name] = this;
			},
			getter: function(){
				return this.value;
			},
			setter: function(value){
				this.value = value;
			}
		}).assign({
			setup: function(parent, name){
				name = name[0].toLowerCase() + name.substring(1);
				// don't assign it, as with a normal property
				new this({
					name: name,
					parent: parent
				});
			}
		});

		var Module = Base3.extend({
			prop: function(names){
				if (arguments.length === 1 && this.props[names]){
					return this.props[names];
				} else {
					for (var i = 0; i < arguments.length; i++){
						new Property({
							name: arguments[i],
							parent: this
						});
					}
				}
			},
			// we could skip copying this to the instance, by default, as it would rarely be needed...  and cleans up the appearance of the prototype
			SomeProp: Property.extend(),
		});

		// assert(Module.prototype.someProp instanceof Property);

		var mod = Module();

		assert(is.undef(mod.someProp));
		assert(mod.props.someProp instanceof Property);

		mod.someProp = 5;

		assert(mod.someProp === 5);
		assert(mod.props.someProp.value === 5);

	});
});

});