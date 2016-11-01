var ModFn = require("../ModFn/ModFn");
var createConstructor = require("../Base/createConstructor");
var track = require("../track/track");


var Extend = module.exports = ModFn.extend({
	// first arg is ctx, and can be stripped with this.args(arguments);
	main: function(Base, o){
		if (o && o.Extend)
			return this.intervention.apply(this, arguments);

		var Ext = this.createConstructor(this.getName(o, Base));
		this.setupConstructor(Ext, Base);
		this.createPrototype(Ext, Base);
		// do this before .set
		this.instantiatePrototype(Ext, Base);
		this.setupPrototype(Ext, Base, this.args(arguments));
		return Ext;
	},
	intervention: function(Base, o){
										// ExtendI, I for Intervention...
		var NewExtend = Base.Extend.extend({ name: "ExtendI" }, o.Extend); // whoa
		delete o.Extend; // make sure we don't recursively intervene
		var newExtend = new NewExtend(); // whoa
		var Ext = newExtend.fn.apply(Base, this.args(arguments));
		Ext.Extend = NewExtend;
		Ext.extend = newExtend.fn;
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
		// Ext.prototype.type = Ext.name;
		Ext.prototype.name = Ext.name[0].toLowerCase() + Ext.name.substring(1);
	},
	setupPrototype: function(Ext, Base, args){
		Ext.prototype.assign.apply(Ext.prototype, args);
	},
	instantiatePrototype: function(){
		// override point
	}
});