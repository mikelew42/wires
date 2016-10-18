var createConstructor = require("./createConstructor");
var Extend = require("./ExtendModFn");
var create = require("./create");
var isExtensionOf = require("./isExtensionOf");


// Base constructor
var Base = createConstructor("Base");

Base.assign({
	extend: new Extend().fn,
	isExtensionOf: isExtensionOf
});

Base.prototype.assign({
	create: create,
	init: function(){}
});

module.exports = Base;