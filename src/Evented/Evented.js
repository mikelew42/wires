var createConstructor = require("./createEventedConstructor");
var extend = require("../Base/extend");
var create = require("../Base/create");
var isExtensionOf = require("../Base/isExtensionOf");

var Evented = createConstructor("Evented");

Evented.assign({
	extend: extend, // allows "classical inheritance"
	isExtensionOf: isExtensionOf
});

Evented.prototype.assign({
	create: create, // basically a pre-init.  the only method called directly from within the Constructor
	init: function(){}
});

module.exports = Evented;