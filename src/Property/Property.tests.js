var TestFramework = require("../test/framework");
var test = TestFramework.test;
var assert = console.assert.bind(console);
var is = require("../is");
var $ = require("jquery");
var Base3 = require("../Base3/Base3");
var Property = require("./Property");

$(function(){

test("Property", function(){

	test("basic", function(){
		var Module = Base3.extend({
			// prop: function(names){
			// 	if (arguments.length === 1 && this.props[names]){
			// 		return this.props[names];
			// 	} else {
			// 		for (var i = 0; i < arguments.length; i++){
			// 			new Property({
			// 				name: arguments[i],
			// 				parent: this
			// 			});
			// 		}
			// 	}
			// },
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

	test("inheritance", function(){
		var Module = Base3.extend({
			SomeProp: Property.extend({
				value: 5
			})
		});

		var mod = Module();
		assert(mod.someProp === 5);

		var Mod2 = Module.extend({
			SomeProp: {
				value: 6
			}
		});
		var mod2 = Mod2();
		assert(mod2.someProp === 6);
	});
});

});