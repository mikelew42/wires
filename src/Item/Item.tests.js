var TestFramework = require("../test/framework");
var test = TestFramework.test;
var assert = console.assert.bind(console);
var is = require("../is");
var $ = require("jquery");
var View = require("../core/View");

var Item = require("./Item");
	console.log(View.prototype.$el.attr("class"))

var Icon = require("./Icon");
	console.log(View.prototype.$el.attr("class"))

$(function(){

var Tests = new View({
	$container: $("body")
});

test("Icon", function(){
	Icon("beer");
	Icon("plane");
	
	console.log(View.prototype.$el.attr("class"))

	View("hello world");

});


test("Item", function(){

	test("note", function(){
		View("You could automate testing of the markup generated, by using outerHtml.");
		View("You wouldn't want to have to do it manually, and so you'd need an 'approve' feature, that would save the markup for future comparison.");
	});

	test("default", function(){
		Item();
	});

	test("named", function(){
		Item("yea?");
	});

	test("no icon", function(){
		Item({
			icon: false
		});
	});

	test("extend if you want default: no icon", function(){
		var Item2 = Item.extend({
			icon: false
		});

		Item2();
		Item2({
			icon: "folder"
		})
	});

	test("with value", function(){
		Item({
			label: "Icon Item with Number Value",
			value: 123,
			icon: "coffee"
		});

		Item({
			label: "Icon Item with String Value",
			value: "123",
			icon: "credit-card"
		});		

		Item({
			label: "Icon Item with True Value",
			value: true,
			icon: "credit-card"
		});

		Item({
			label: "Icon Item with False Value",
			value: false,
			icon: "credit-card"
		});
	});

	test("with value, no icon", function(){
		Item({
			label: "Value, but no icon",
			icon: false,
			value: "Yee haw"
		})
	});

});

});