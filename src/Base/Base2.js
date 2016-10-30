var createConstructor = require("./createConstructor");
var Extend = require("../ExtendModFn/ExtendModFn");
var create = require("./create");
var isExtensionOf = require("./isExtensionOf");
var track = require("../track/track");

var Base2 = createConstructor("Base2");

track(Base2);
track(Base2.prototype);

Base2.assign({
	Extend: Extend,
	extend: new Extend().fn,
	isExtensionOf: isExtensionOf
});

Base2.prototype.assign({
	create: create,
	init: function(){}
});

module.exports = Base2;