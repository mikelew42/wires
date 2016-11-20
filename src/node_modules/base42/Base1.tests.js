var TestFramework = require("test/framework");
var test = TestFramework.test;
var is = require("is");
var $ = require("jquery");
var assert = console.assert.bind(console);

var Base1 = require("./Base1");

$(function(){

test("Base1", function(){
	test("basic", function(){
		var base = Base1();
		assert(base instanceof Base1);
		assert(base.constructor === Base1);
	});
});

});