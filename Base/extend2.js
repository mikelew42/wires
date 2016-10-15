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
		console.groupCollapsed(Ext.name + " extends " + this.name);
		console.trace();
		extend.setupSubbableConstructor(Ext, this, o);
		extend.createPrototype(Ext, this);
		extend.setupSubbablePrototype(Ext, this, arguments);
		Ext.events.emit("extended", Ext, this);
		console.groupEnd();
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
		extend.recursiveExtend(Ext, args);
		// Ext.prototype.assign.apply(Ext.prototype, args);
		extend.elevateProtoClasses(Ext);
	},
	// this is basically just the eventedAssign function
	recursiveExtend: function(Ext, args){
		var arg, prop;
		// allow multiple objects
		for (var i = 0; i < args.length; i++){
			arg = args[i];
			// loop over each property
			for (var propName in arg){
				propValue = arg[propName];
				// if the prototype[prop] is a Sub class, and the incoming property is an object, then pass that obj to extend, and replace the prototype[prop] with the new class
				if (is.fn(Ext.prototype[propName]) && Ext.prototype[propName].extend && is.obj(propValue) ){
					console.log("recursiveExtending");
					Ext.prototype[propName] = 
						Ext.prototype.applyFilter("recursiveExtend", Ext.prototype[propName].extend(propValue), propName);
				} else {
					// assign it to this
					Ext.prototype[propName] = Ext.prototype.applyFilter("assign", propValue, propName);
				}
			}
		}
		return this;
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
				if (Ext[i] !== Ext.prototype[i])
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