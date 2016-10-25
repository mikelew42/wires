var createConstructor = require("./createEventedConstructor");
var extend = require("./extend");
var create = require("./create")

var Evented = createConstructor("Evented");

Evented.assign({
	extend: extend // allows "classical inheritance"
});

Evented.prototype.assign({
	create: create, // basically a pre-init.  the only method called directly from within the Constructor
	init: function(){}
});

module.exports = Evented;