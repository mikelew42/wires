var id = 0;
var $ = require("jquery");
var is = {
	$panel: $("<div></div>").addClass("panel light").css({ marginTop: "50px"}),
	view: function(value, name){
		var $item = $("<div>").addClass("item");
		var $name = $("<div>").addClass("name").appendTo($item);
		if (name)
			$name.html(name);
		else
			$name.html("unnamed");

		var $value = $("<div>").addClass("value").appendTo($item);
		if (value.render){
			$value.append(value.render());
		} else {
			$value.addClass(typeof value).append(value.toString());
		}

		return $item;
	},
	nextID: function(){
		return ++id;
	},
	arr: function(value){
		return toString.call(value) === '[object Array]';
	},
	obj: function(value){
		return typeof value === "object" && !is.arr(value);
	},
	val: function(value){
		return ['boolean', 'number', 'string'].indexOf(typeof value) > -1;
	},
	str: function(value){
		return typeof value === "string";
	},
	num: function(value){
		return typeof value === "number";
	},
	bool: function(value){
		return typeof value === 'boolean';
	},
	fn: function(value){
		return typeof value === 'function';
	},
	sfn: function(value){
		return is.fn(value) && value.main;
	},
	def: function(value){
		return typeof value !== 'undefined';
	},
	undef: function(value){
		return typeof value === 'undefined';
	},
	simple: function(value){ // aka non-referential
		return typeof value !== 'object' && !is.fn(value); // null, NaN, or other non-referential values?
	}
};

$(function(){
	is.$panel.appendTo("body");
});

module.exports = is;