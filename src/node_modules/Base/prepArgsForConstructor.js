var argsToArray = require("./argsToArray");

// convert arguments to array and add a null context for the binding
var prepArgsForConstructor = function(args){
	args = argsToArray(args);
	args.unshift(null);
	return args;
};

module.exports = prepArgsForConstructor;