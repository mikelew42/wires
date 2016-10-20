var ModFn = require("./ModFn");
var createConstructor = require("./createConstructor");
var track = require("./track");


var Extend = module.exports = ModFn.extend({
	main: function(Base, o){
		var Ext = this.createConstructor(this.name(o, Base));
		this.setupConstructor(Ext, Base);
		this.createPrototype(Ext, Base);
		this.setupPrototype(Ext, Base, this.args(arguments));
		return Ext;
	},
	name: function(o, Base){
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