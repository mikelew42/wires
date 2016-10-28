var createConstructor = require("./createConstructor");
var Extend = require("../ExtendModFn/ExtendModFn");
var create = require("./create");
var isExtensionOf = require("./isExtensionOf");
var track = require("../track/track");

var Base = createConstructor("Base");

track(Base);
track(Base.prototype);

Base.assign({
	extend: new Extend().fn,
	isExtensionOf: isExtensionOf
});

Base.prototype.assign({
	create: create,
	init: function(){}
});

module.exports = Base;