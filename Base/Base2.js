var createConstructor = require("./createConstructor");
var extend = require("./extend");
var create = require("./create")


// Base constructor
var Base = createConstructor("Base");

Base.assign({
	extend: extend,
	isExtensionOf: function(Base){
		var base = this.base;
		while(base){
			if (base === Base)
				return true;
			base = base.base;
		}
		return false;
	}
});

Base.prototype.assign({
	create: create,
	init: function(){}
});

module.exports = Base;