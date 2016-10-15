console.groupCollapsed("Logged.js");

var Filterable = require("./Filterable");
var Module = require("./Module");
var eventedAssign = require("./eventedAssign.js");
var Logger = require("../log/Logger");
var is = require("../is");
var track = require("./track");
var createConstructor = require("./createEventedConstructor");
var events = require("events");
var extend2 = require("./extend2");

var _log, log = _log = Logger({
	
});

var create = function(o){
	console.groupCollapsed( ((o && o.name) || this.name) + " = new " + this.constructor.name + "(", arguments, ")");
	track.call(this);
	initMethodAutoWrapper.call(this);
	this.assign.apply(this, arguments);
	this.init && this.init();
	console.groupEnd();
};

var initMethodAutoWrapper = function(){
	this.filter("assign", function(value, name){
		var log = this.log || _log;
		if (is.fn(value) && !value.wrapped && !value.extend){
			return log.__method({
				name: name,
				method: value
			});
		}
		return value;
	});
};

var initLoggerIntercept = function(){
	this.filter("assign", function(value, name){
		// this should only run for the prototype
		// this === prototype
		if (name === "Logger")
			this.constructor.log = this.log = new value();
		return value;
	});
};

var initSubClassElevationFilter = function(){
	this.filter("assign", function(value, name){
		// this should only run for the prototype
		// this === prototype
		if ((is.fn(value) && value.extend) || name === "methods"){
			if (i === "constructor")
				return value;

			this.constructor[name] = value;
		}
		return value;
	});
};

var Logged = Module.extend({
	name: "Logged",
	create: create,
	assign: eventedAssign,
	// .config gets plucked and put onto the Class directly...
	config: function(){
		// this === Logged
		this.events.on("extended", function(Ext){
			// wrap this with init_log, to make it easy to extend?
			// but, we want this to run on extend, not for each instance
			// console.log("Logged.events.extended -> creating Logged.log");
			if (!Ext.prototype.hasOwnProperty("log"))
				Ext.log = Ext.prototype.log = new Ext.prototype.Logger();
			// if you modify Logger class in an unintelligent way (something that won't be inherited automatically), then you need to recreate this log instance
				// modifying the prototype should be legit...
				// log.Method, for example
				// log.Method.methods should be shared, too...
		});

		this.events.on("setupPrototype", function(Ext, Base, args){
			// runs right before incoming args are assigned to prototype
			
			// enable events
			events.call(Ext.prototype);
			Ext.prototype._events = {}; // clobber it!

			initMethodAutoWrapper.call(Ext.prototype);
			initLoggerIntercept.call(Ext.prototype);
			initSubClassElevationFilter.call(Ext.prototype);
		});
	},
	Logger: Logger.extend({
		name: "Loggedr",
		Method: Logger.Method.extend({

		})
	})
});



// Logged.extend = log.wrapMethod("extend", function(o){
// 	var name, props, Ext, logArgs;

// 	name = (o && o.name) || (this.name + "Ext");
	
// 	Ext = createConstructor(name);

// 	// copy this.props to Ext
// 	// Ext.assign(this); // should these be wrapped?  come back to this

// 	handleClassSubs(this, Ext);

// 	Ext.prototype = Object.create(this.prototype);
// 	Ext.prototype.constructor = Ext;
// 	Ext.base = this;
// 	Ext.prototype.type = name;

// // this.emit("extended");
// 	// enable fn wrapping, by enabling events on the prototype
// 	// this allows us to use the eventedAssign
// 	// in fact, these 3 lines of code should be a pluggable event...
// 		// but, we need to keep this .extend override one way or another, b/c we can't add events to the Base class
// 	events.call(Ext.prototype);
// 	Ext.prototype._events = {}; // clobber it to prevent any leakage
	
// 	initMethodAutoWrapper.call(Ext.prototype);

// 	initLoggedClass.call(Ext);
// 	if (this.log){
// 		this.log.log("copying Constructor.log");
// 		Ext.log = Ext.prototype.log = this.log.copy();
// 		this.log.log(Ext.log);
// 	}



// 	Ext.prototype.assign.apply(Ext.prototype, arguments);
// 	return Ext;
// });

// Logged.log.off();
// module.exports = Logged.extend();
// Logged.log.on();

module.exports = Logged;

console.groupEnd();