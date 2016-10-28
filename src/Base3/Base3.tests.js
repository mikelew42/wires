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
				set: new Set({
					arg: function(mod, arg){
						check.args.push(arg);
					}
				}).fn
			}), check = { args: [] };

			var base = new Base4();

			base.set(1, 2, 3, 4);

			assert(check.args.length === 4);
			assert(check.args[0] === 1);
			assert(check.args[1] === 2);
			assert(check.args[2] === 3);
			assert(check.args[3] === 4);
		});
	});

});

});