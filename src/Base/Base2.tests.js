var Test = require("./Test");
var expect = Test.expect;
var Base = require("./Base");
var is = require("../is");

// expect(is.fn(Base.extend)).toBe(true); // unncessary.. this problem will reveal itself...

console.groupCollapsed("Base2.tests.js");
var Test1 = Test.extend({
	name: "Test1",
	setup: function(){ // usage
		this.base = new Base();
	}
});

new Test1({
	name: "Test1_1",
	test: function(){
		expect(this.base instanceof Base).toBe(true);
		expect(this.base.constructor).toBe(Base);
	}
});

new Test1({
	name: "Test1_2",
	test: function(){
		this.base.assign({
			prop: 123
		});
		expect(this.base.prop)
		expect(is.fn())
	}
});
console.groupEnd();

/*
describe("Something", function(){
	var base;

	setup(function(){
		base = new Base();
	});

	// if this fn runs for each "it" block contained within, it will automatically reset the entire state.

	// if you wanted something to persist, you could set it up outside the fn

	// but maybe that's the point - you want all vars to be contained, so you don't have to worry about naming?

	// then you'd have to use a "reset" function:


});
*/