var createConstructor = require("./createConstructor");
var extend = require("./extend");
var create = require("./create");
var track = require("../track/track");
var isExtensionOf = require("./isExtensionOf");


// Base constructor
var Base = createConstructor("Base");
track(Base);
track(Base.prototype);

Base.assign({
	extend: extend,
	isExtensionOf: isExtensionOf
});

Base.prototype.assign({
	create: create,
	init: function(){}
});

module.exports = Base;