var prepArgsForConstructor = require("./prepArgsForConstructor");
var assign = require("./assign");

// TODO make this a normal function, use fn.toString() and then some str replacing 
// to allow a normal function to be passed, that uses a special.. "Constructor" name
// as the placeholder for the variable name?
		// this allows a new constructor template function to be used similarly below,
		// without having to do all the special concatenation...
var createConstructor = function(name){
	eval("var " + name + ";");
	var constructor = eval("(" + name + " = function " + name + "(o){\r\n\
	if (!(this instanceof " + name + "))\r\n\
		return new (" + name + ".bind.apply(" + name + ", prepArgsForConstructor(arguments)));\r\n\
	this.create.apply(this, arguments);\r\n\
});");
	constructor.assign = assign;
	constructor.prototype.assign = assign;
	return constructor;
}

module.exports = createConstructor;