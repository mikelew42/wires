var createConstructor = require("./createConstructor");
var createEventedConstructor = require("../Evented/createEventedConstructor");
var EventEmitter = require("events");
var is = require("../is");
var track = require("../track/track");
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
		// console.groupCollapsed(Ext.name + " extends " + this.name + " (extend2.subbable)");
		// console.trace();
		extend.setupSubbableConstructor(Ext, this, o);

		// console.log("createPrototype, and relink a few props");
		extend.createPrototype(Ext, this);


		extend.setupSubbablePrototype(Ext, this, arguments);
		Ext.events.emit("extended", Ext, this);
		// console.groupEnd();
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
		// console.group("extend2.setupSubbableConstructor");

		// console.log(".handleClassProps(), copies some Base[props] to Ext[props]");
		extend.handleClassProps(Ext, Base);

		// console.log("Ext.events = new EventEmitter();");
		Ext.events = new EventEmitter();
		// console.log("Ext.base = Base");
		Ext.base = Base;
		

		// console.group("config: pluck and call")

		// must be after the above .handleClassSubs call
		if (o && o.config){
			Ext.config = o.config;
			delete o.config;
		} // must also be before the .events EE is created below

		Ext.config && Ext.config();
		// console.groupEnd();

		// console.groupEnd();
	},
	createPrototype: function(Ext, Base){
		Ext.prototype = Object.create(Base.prototype);
		track(Ext.prototype);
		Ext.prototype.constructor = Ext;
		Ext.prototype.type = Ext.name;
		Ext.prototype.name = Ext.name[0].toLowerCase() + Ext.name.substring(1);
	},
	setupPrototype: function(Ext, Base, args){
		Ext.prototype.assign.apply(Ext.prototype, args);
	},
	setupSubbablePrototype: function(Ext, Base, args){
		// console.group(".setupSubbablePrototype");

		// console.log("Ext.events.emit('setupPrototype')");
		Ext.events.emit("setupPrototype", Ext, Base, args);

		// console.log(".recursiveExtend()");
		extend.recursiveExtend(Ext, args);
		// Ext.prototype.assign.apply(Ext.prototype, args);
		
		// console.log(".elevateProtoClasses");
		extend.elevateProtoClasses(Ext);
		// console.groupEnd();
	},
	// this is basically just the eventedAssign function
	recursiveExtend: function(Ext, args){
		var arg, propValue;
		// allow multiple objects
		for (var i = 0; i < args.length; i++){
			arg = args[i];
			// loop over each property
			for (var propName in arg){
				propValue = arg[propName];
				// if the prototype[prop] is a Sub class, and the incoming property is an object, then pass that obj to extend, and replace the prototype[prop] with the new class
				if (is.fn(Ext.prototype[propName]) && Ext.prototype[propName].extend && is.obj(propValue) ){
					// console.log("recursiveExtending");
					if (!propValue.name)
						propValue.name = Ext.prototype[propName].name;
					Ext.prototype[propName] = 
						Ext.prototype.applyFilter("assign", Ext.prototype.applyFilter("recursiveExtend", Ext.prototype[propName].extend(propValue), propName), propName);
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
		for (var i in Base){ // Constructor shouldn't have .constructor prop..?
			if (i === "base" || i === "events" || i === "constructor" || i === "id")
				continue;
			if (is.fn(Base[i]) && Base[i].extend)
				continue; // leave the Sub classes to the elevateProtoClasses fn
			Ext[i] = Base[i];
		}
	}
};