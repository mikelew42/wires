var createConstructor = require("./createConstructor");
var createEventedConstructor = require("./createEventedConstructor");
var EventEmitter = require("events");
var is = require("../is");
var extend = module.exports = {
	main: function(o){
		var Ext = extend.createConstructor(extend.name(o, this));
		extend.setupConstructor(Ext, this);
		extend.createPrototype(Ext, this);
		extend.setupPrototype(Ext, this, arguments);
		return Ext;
	},
	evented: function(o){
		var Ext = extend.createEventedConstructor(extend.name(o, this));
		extend.setupConstructor(Ext, this);
		extend.createPrototype(Ext, this);
		extend.setupPrototype(Ext, this, arguments);
		return Ext;
	},
	subbable: function(o){
		var Ext = extend.createEventedConstructor(extend.name(o, this));
		extend.setupSubbableConstructor(Ext, this, o);
		extend.createPrototype(Ext, this);
		extend.setupSubbablePrototype(Ext, this, arguments);
		Ext.events.emit("extended", Ext);
		return Ext;
	},
	name: function(o, Base){
		return (o && o.name) || (Base.name + "Ext");
	},
	createConstructor: function(name){
		return createConstructor(name);
	},
	createEventedConstructor: function(name){
		return createEventedConstructor(name);
	},
	setupConstructor: function(Ext, Base){
		var id = Ext.id;
		Ext.assign(Base);
		Ext.id = id; // bleh
		Ext.base = Base;
	},
	setupSubbableConstructor: function(Ext, Base, o){
		extend.handleClassProps(Ext, Base);

		// must be after the above .handleClassSubs call
		if (o && o.config){
			Ext.config = o.config;
			delete o.config;
		} // must also be before the .events EE is created below

		Ext.events = new EventEmitter();
		Ext.base = Base;
		Ext.config && Ext.config();
	},
	createPrototype: function(Ext, Base){
		var protoID = Ext.prototype.id;
		Ext.prototype = Object.create(Base.prototype);
		Ext.prototype.id = protoID;
		Ext.prototype.constructor = Ext;
		Ext.prototype.type = Ext.name;
	},
	setupPrototype: function(Ext, Base, args){
		Ext.prototype.assign.apply(Ext.prototype, args);
	},
	setupSubbablePrototype: function(Ext, Base, args){ 
		Ext.events.emit("setupPrototype", Ext, Base, args);
		Ext.prototype.assign.apply(Ext.prototype, args);
		extend.elevateProtoClasses(Ext);
	},
	elevateProtoClasses: function(Ext){
		var prop;
		for (var i in Ext.prototype){
			prop = Ext.prototype[i];
			if (is.fn(prop) && prop.extend){
				if(i === "constructor")
					continue;
				// protect the underlying prototype
				if (!Ext.prototype.hasOwnProperty(i)){
					Ext.prototype[i] = prop.extend();
				}
				// sync sub classes to constructor
				Ext[i] = Ext.prototype[i];
			}
		}
	},
	handleClassProps: function(Ext, Base){
		for (var i in Base){
			if (i === "base" || i === "events" || i === "constructor" || i === "id")
				continue;
			if (is.fn(Base[i]) && Base[i].extend)
				continue; // leave the Sub classes to the elevateProtoClasses fn
			Ext[i] = Base[i];
		}
	}
};