var TestFramework = require("./Base/TestFramework");
var test = TestFramework.test;
var $ = require("jquery");

var utils = require("./utils.js");
var hashCode = utils.hashCode;
var numToChar = utils.numToChar;
var stringToCrazyNumber = utils.stringToCrazyNumber;
var hash = utils.hash;

var expect = function(value){
	console.assert(value);
};

$(function(){
	test("hashCode", function(){

		console.log(hashCode("hello"));

	});

	test("numToChar", function(){
		console.log(numToChar(1234.6))
	});

	test("stringToCrazyNumber", function(){
		console.log(stringToCrazyNumber("hello worl"))
	});

	test("h", function(){
		console.log(hash("wtf"));
	})
});