var is = {
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
	},
	Class: function(value){
		return is.fn(value) && value.extend;
	},
	// better than "Class"
	Mod: function(value){
		return is.fn(value) && value.extend;
	},
	/// seems to work
	pojo: function(value){
		return is.obj(value) && value.constructor === Object;
	},
	mod: function(value){
		return is.obj(value) && is.Mod(value.constructor);
	},
	proto: function(value){
		return is.obj(value) && value.constructor && value.constructor.prototype === value;
	}
};
module.exports = is;