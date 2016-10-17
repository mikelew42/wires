var createConstructor = require("./createConstructor");
var extend = require("./extend");
var create = require("./create");
var track = require("./track");


// Base constructor
var Base = createConstructor("Base");
track(Base);
track(Base.prototype);

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