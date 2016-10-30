var TestFramework = require("../test/framework");
var test = TestFramework.test;
var assert = console.assert.bind(console);
var is = require("../is");
var $ = require("jquery");
var View = require("../core/View");

var Item = require("./Item");
var Icon = require("./Icon");

$(function(){

var Tests = new View({
	$container: $("body")
});

test("Icon", function(){
	Icon("beer");
	Icon("shoe");
	View("hello world");
});


test("Item", function(){

	// var item;
	// var block = 
	test("test", function(){
		// item = 
		test("uhh huh", function(){
			Icon("circle");
			// View("yeaaaa");
		});
		test("yea?", function(){
			Item();
		})
	});
	// block.$el.append(item.$el);

});

});