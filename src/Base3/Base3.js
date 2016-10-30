var Base2 = require("../Base/Base2");
var create = require("./create");
var Set = require("./Set");
var Extend = require("../ExtendModFn/ExtendModFn");

var Base3 = module.exports = Base2.extend({
	name: "Base3",
	create: create,
	set: new Set().fn
}).assign({
	Set: Set, // for easy reference
	extend: new Extend({
		setupPrototype: function(Ext, Base, args){
			Ext.prototype.assign.apply(Ext.prototype, args);
		}
	}).fn
});

//!! should we create a new Extend({ }) that uses prototype.set instead of .assign?