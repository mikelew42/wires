// console.groupCollapsed("Logged.js");

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
	track(this);
	initMethodAutoWrapper.call(this);
	this.assign.apply(this, arguments);
	this.init && this.init();
	console.groupEnd();
};

var initMethodAutoWrapper = function(){
	this.filter("assign", function(value, name){
		var log = this.log || _log;
		if (is.fn(value) && !value.wrapped && !value.extend){
			return log.method({
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
TODO harmonize this with the autoWrap feature?  Should we try to loop through all methods, and wrap them?
*/
var reWrapMethods = function(prototype){
	for (var i in prototype){
		// for each wrapped method on this prototype (and anywhere in its prototype chain)...
		if (is.fn(prototype[i]) && prototype[i].method){

			if (is.def(prototype.log.methods[i])){
				// bool + false
				if ( is.bool(prototype.log.methods[i]) && !prototype.log.methods[i] ){
					// unwrap it
					prototype[i] = prototype[i].method.method;

				// bool + true
				} else if (is.bool(prototype.log.methods[i]) && prototype.log.methods[i] ){
					// if its the correct instance, skip it
					if (prototype[i].method instanceof prototype.log.Method)
						continue;
					// if the default logger has been updated, rewrap it
					else
						prototype[i] = prototype.log.method({
							name: i,
							method: prototype[i].method.method
						});

				// assume methods[name] is a Method class, and if its the wrong one, rewrap
				} else if (!(prototype[i].method instanceof prototype.log.methods[i]) ){ // incorrect Method class
					// rewrap
					prototype[i] = prototype.log.method({
						name: i,
						method: prototype[i].method.method
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

			// after all changes to .methods{}, we need to apply these effects
			reWrapMethods(Ext.prototype);

			console.groupEnd();
		});

		this.events.on("setupPrototype", function(Ext, Base, args){
			console.groupCollapsed("Logged.events on setupPrototype");
			// runs right before incoming args are assigned to prototype
			
			// enable events
			events.call(Ext.prototype);
			Ext.prototype._events = {}; // clobber it!

			// assign fn --> wrap it
			initMethodAutoWrapper.call(Ext.prototype);

			// assign "Logger" --> new .log
			initLoggerIntercept.call(Ext.prototype);

			// the elevator:  if Sub classes or .methods{} are assigned, elevate to Class
			initSubClassElevationFilter.call(Ext.prototype);

			console.groupEnd();
		});

		console.groupEnd();
	},
	Logger: Logger.extend({
		name: "Loggedr",
		methods: {
			create: {
				methodLabel: function(ctx, args){
					this.name = "";
					if (args && args[0] && args[0].name){
						this.name += "var " + args[0].name + " = "; 
					}
					this.name += "new " + ctx.name;

					this.argNames = [];
					return this.fnLabel(ctx, args);
				}
			}
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

// Logged.log.stop();
// module.exports = Logged.extend();
// Logged.log.start();

module.exports = Logged;

// console.groupEnd();