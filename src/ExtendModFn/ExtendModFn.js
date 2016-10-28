var ModFn = require("../ModFn/ModFn");
var createConstructor = require("../Base/createConstructor");
var track = require("../track/track");


var Extend = module.exports = ModFn.extend({
	// first arg is ctx, and can be stripped with this.args(arguments);
	main: function(Base, o){
		var Ext = this.createConstructor(this.getName(o, Base));
		this.setupConstructor(Ext, Base);
		this.createPrototype(Ext, Base);
		this.setupPrototype(Ext, Base, this.args(arguments));
		return Ext;
	},
	getName: function(o, Base){
		return (o && o.name) || (Base.name + "Ext");
	},
	createConstructor: function(name){
		return createConstructor(name);
	},
	setupConstructor: function(Ext, Base){
		Ext.assign(Base);
			track(Ext); // must happen after the above .assign
		Ext.base = Base;
	},
	createPrototype: function(Ext, Base){
		Ext.prototype = Object.create(Base.prototype);
			track(Ext.prototype);

		Ext.prototype.constructor = Ext;
		Ext.prototype.type = Ext.name;
	},
	setupPrototype: function(Ext, Base, args){
		Ext.prototype.assign.apply(Ext.prototype, args);
	}
});