var prepArgsForConstructor = require("./prepArgsForConstructor");
var assign = require("./assign");

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