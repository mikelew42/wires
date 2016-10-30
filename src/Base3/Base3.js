var Base2 = require("../Base/Base2");
var create = require("./create");
var Set = require("./Set");
var Extend = require("../ExtendModFn/ExtendModFn");

var Base3 = module.exports = Base2.extend({
	name: "Base3",
	create: create,
	set: new Set().fn
}).assign({
	// we don't want this to run immediately in this case, because Base2.prototype.set doesn't exist...
	Extend: Base2.Extend.extend({
		setupPrototype: function(Ext, Base, args){
			Ext.prototype.set.apply(Ext.prototype, args);
		}
	})
});

Base3.extend = new Base3.Extend().fn;

/*
Do we want to use .set on extend?
- Recursively set?
- Set as a ModFn allows great extensibility...
- Matches the new ({})--> .set pattern

Should be as close to assign as possible... and maybe split from a more advanced .set, in case it deviates:
- override fns with fns

Currently, set doesn't do much other than assign:
- it calls .set on props, if present
- it calls fns with arrays or non-fn values
- it allows easy override, if you need to upgrade
- it provides override points for set("str", 123, etc)

*/