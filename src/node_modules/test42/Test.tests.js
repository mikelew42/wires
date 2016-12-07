// var testFramework = require("test/framework");
// var test = testFramework.test;
// var assert = console.assert.bind(console);
// var is = require("../is");
// var $ = require("jquery");
// var View = require("View");

var test = require("test42");

test("one", function(){
	this.error("uh oh");
	console.log("yo");
	console.log(global)

	this.view.h3("This is an h3 inside test 'one'");
});

test("maybe", function(){
	console.log("yee haw");
	this.view.h3("This is an h3 inside test 'maybe'");

	test("and can we nest them?", function(){
		this.view.h3("This is an h3 inside test 'and can we..'");
		console.log("one");
	});

	this.view.h3("This is an h3 inside test 'maybe', between the first and second");
	
	test("two?", function(){
		console.log("two");
	});

	this.view.h3("This is an h3 inside test 'maybe', between the first and second");
});

test("another", function(){
	console.log("another...");
})