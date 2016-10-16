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
		if (name === "constructor")
			return value;

		if ((is.fn(value) && value.extend) || name === "methods"){
			this.constructor[name] = value;
		}
		return value;
	});
};

/*
The problem here, is that if we just check the methods for .wrapper, and if its 
*/
var reWrapMethods = function(prototype){
	for (var i in prototype){
		if (is.fn(prototype[i]) && prototype[i].method){
			// how do we determine whether to re-wrap?
			// 1)  is there a custom method?
			// 2)  if not, does it match the loggers default method?

	// make a log.isCorrectMethodClass helper?
/*
Or, make a log.wrap function that does the looping/wrapping, but checks if its already wrapped properly before doing so.  That way, we can just call this.log.wrap(this); on init?

Should we just wrap all methods, and put them directly on the instances
*/
			if (is.def(prototype.log.methods[i])){
				if ( (is.bool(prototype.log.methods[i]) && prototype.log.methods[i]) // true or
					  || !(prototype[i].method instanceof prototype.log.methods[i]) ){ // 
						prototype[i] = prototype.log.method({
							name: i,
							method: prototype[i].method.method;
						});
				}
			}
		}

	}
};

var Logged = Module.extend({
	name: "Logged",
	create: create,
	assign: eventedAssign,
	// .config gets plucked and put onto the Class directly...
	config: function(){
		console.group(this.name + ".config");
		// this === Logged
		this.events.on("extended", function(Ext){
			console.groupCollapsed("Logged.events on extended");
			
			if (!Ext.prototype.hasOwnProperty("log"))
				Ext.log = Ext.prototype.log = new Ext.prototype.Logger();



			console.groupEnd();
		});

		this.events.on("setupPrototype", function(Ext, Base, args){
			console.groupCollapsed("Logged.events on setupPrototype");
			// runs right before incoming args are assigned to prototype
			
			// enable events
			events.call(Ext.prototype);
			Ext.prototype._events = {}; // clobber it!

			initMethodAutoWrapper.call(Ext.prototype);
			initLoggerIntercept.call(Ext.prototype);
			initSubClassElevationFilter.call(Ext.prototype);

			console.groupEnd();
		});

		console.groupEnd();
	},
	Logger: Logger.extend({
		name: "Loggedr",
		methods: {
			create: false
		}
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