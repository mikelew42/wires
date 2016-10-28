var TestFramework = require("../test/framework");
var expect = TestFramework.expect;
var test = TestFramework.test;
var Base2 = require("./Base2");
var is = require("../is");
var $ = require("jquery");
var assert = console.assert.bind(console);

$(function(){

test("Base2", function(){

	test("standard methods", function(){
		assert(is.fn(Base2.assign));
		assert(is.fn(Base2.extend));
		assert(is.fn(Base2.isExtensionOf));
		assert(is.fn(Base2.prototype.assign));
		assert(is.fn(Base2.prototype.create));
		assert(is.fn(Base2.prototype.init));
	});

	test("clean instance", function(){
		var base = new Base2();
		// console.log(base.id);
		// and test w/o "new"?


		test("instanceof and .constructor", function(){
			assert(base instanceof Base2);
			assert(base.constructor === Base2);
		});

		test("track", function(){
			assert(is.num(base.id));
			assert(is.num(Base2.id));
			assert(is.num(Base2.prototype.id));
			assert(base.id !== Base2.prototype.id);
			assert(Base2.id !== Base2.prototype.id);
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
			base = Base2({
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
			var Base3 = Base2.extend();

			test("isExtensionOf", function(){
				assert(Base3.isExtensionOf(Base2));
			});

			test(".base", function(){
				assert(Base3.base === Base2);
			});

			test("standard methods", function(){
				assert(is.fn(Base3.assign));
				assert(is.fn(Base3.extend));
				assert(is.fn(Base3.isExtensionOf));
				assert(is.fn(Base3.prototype.assign));
				assert(is.fn(Base3.prototype.create));
				assert(is.fn(Base3.prototype.init));
			});

			test("instance", function(){
				var base = new Base3();

				assert(base instanceof Base3);
				assert(base instanceof Base2);
				assert(base.constructor === Base3);
	
				test("track", function(){
					assert(is.num(base.id));
					assert(is.num(Base3.id));
					assert(is.num(Base3.prototype.id));
					assert(base.id !== Base3.prototype.id);
					assert(Base3.id !== Base3.prototype.id);
				});
			});
		});

		test("with name", function(){
			var Base3 = Base2.extend({
				name: "Base3"
			});

			assert(Base3.name === "Base3");
			assert(Base2.name !== "Base3");
		});

		test("with props", function(){
			var check = {};
			var Base3 = Base2.extend({
				name: "Base3",
				prop: 123,
				init: function(){
					check.init = true;
				}
			}, {
				prop: 456
			});


			assert(!check.init);
			assert(Base3.prototype.prop === 456);

			var base = new Base3();
			assert(check.init);


		});
	});
});

});