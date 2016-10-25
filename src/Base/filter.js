var argsToArray = require("./argsToArray");

var filter = exports.filter = function(name, fn){
	this.on(name, function(filter){
		filter.value = fn.apply(this, [filter.value].concat(filter.args));
	});
};

var applyFilter = exports.applyFilter = function(name, value){
	var filter = { 
		value: value, 
		args: argsToArray(arguments).slice(2)
	};
	this.emit(name, filter);
	return filter.value;
};