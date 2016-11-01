var Base = require("../Base");
var is = require("../is");
var noop = function(){};
var getParamNames = require("./getParamNames");
var Method = require("./Method");
var Module = require("../Module/Module");
var events = require("events");

var methods = [
	{
		name: "log"
	},
	{
		name: "group"
	},
	{
		name: "groupc",
		consoleName: "groupCollapsed"
	},
	{
		name: "debug"
	},
	{
		name: "trace"
	},
	{
		name: "error"
	},
	{
		name: "warn",
	},
	{
		name: "info"
	}
];

var extendMethods = function(methods, extenders, logger){
	var newMethods = {};

	// if we have extenders, we need to rewrap those methods... 
	// how do we get access to the Logged.prototype, in order to do that?
		// i'll try looping through the new logged prototype
	if (extenders){
		// start by looping through them
		for (var i in extenders){
			if (is.bool(extenders[i]) || (extenders[i] instanceof Method) ){
				newMethods[i] = extenders[i];
			// extenders[i] should be an object at this point
			} else if (is.obj(extenders[i])) {
				if (methods[i] && methods[i].isExtensionOf(Method)){
					newMethods[i] = methods[i].extend({
						name: methods[i].name
					}, extenders[i]);
				} else {
					newMethods[i] = logger.Method.extend({
						name: logger.Method.name
					}, extenders[i]);
				}
			}
		}
	}

	// but, we still need to extend the remaining methods
	for (var j in methods){
		if (is.def(newMethods[j]))
			continue;
		if (is.bool(methods[j])) {
			newMethods[j] = methods[j];
		} else if (methods[j].isExtensionOf(Method)){
			newMethods[j] = methods[j].extend({
				name: methods[j].name
			});
		}
	}

	return newMethods;
};

var initAssignFilters = function(){
	this.filter("assign", function(value, name){
		var newMethods = {};
		if (name === "methods"){
			// console.warn("Logger.prototype.assign methods");
			return extendMethods(this.methods, value, this);
		}
		return value;
	});
};

var Logger = Module.extend({
	name: "Logger",
	Method: Method,
	methods: {},
	config: function(){
		// console.groupCollapsed("Logger.config");
		// this === Class
		this.events.on("extended", function(Ext, Base){
			// console.groupCollapsed("Logger.events on extended");
			// Ext === the new class
			Ext.start = Ext.prototype.start.bind(Ext.prototype);
			Ext.stop = Ext.prototype.stop.bind(Ext.prototype);


			if (!Ext.prototype.hasOwnProperty("methods"))
				Ext.prototype.methods = extendMethods(Ext.prototype.methods);

			Ext.methods = Ext.prototype.methods;
			// console.groupEnd();
		});

		this.events.on("setupPrototype", function(Ext, Base, args){
			// console.groupCollapsed("Logger.events on setupPrototype");
			// enable events
			events.call(Ext.prototype);
			Ext.prototype._events = {}; // clobber it!

			initAssignFilters.call(Ext.prototype);
			// console.groupEnd();
		});

		// console.groupEnd();
	},
	init: function(){
		this.methods = extendMethods(this.methods);
		if (this.disable)
			this.stop();
	},

	copy: function(){
		var ownProps = {},
			ownPropNames = Object.getOwnPropertyNames(this),
			propName;
		
		for (var i = 0; i < ownPropNames.length; i++){
			propName = ownPropNames[i];
			ownProps[propName] = this[propName]; 
		}

		return new this.constructor(ownProps); // "new" keyword is required here!!
	},

	end: function(fn){
		fn();
		console.groupEnd();
	},
	xend: noop,

	stop: function(){
		var method;
		for (var i in methods){
			method = methods[i];
			this[method.name] = noop;
		}
		this.disable = true;
	},

	start: function(){
		var method;
		for (var i in methods){
			method = methods[i];
			this[method.name] = this["$" + method.name];
		}
		this.disable = false;
	},

	xwrapMethod: function(name, fn){
		return fn;
	},

	// { name, method, any other config... }
	method: function(opts){
		// store this on .methods[name] ??  no - the logger is shared between all instances of a class, by default, and we want to be able to customize each 
		if (opts && opts.name && is.def(this.methods[opts.name])){
			if (this.methods[opts.name] === false)
				return opts.method; // no wrap for you
			return new this.methods[opts.name](opts, {log: this}).wrapper();
		}
		else
			return new this.Method(opts, {log: this}).wrapper()
	}
});

var initMethods = function(){
	var method, consoleName; 
	for (var i in methods){
		method = methods[i];
		consoleName = method.consoleName || method.name;
		this[method.name] = console[consoleName].bind(console);
		this["$" + method.name] = this[method.name];
		
// !!! This should be suppress.
		this["x" + method.name] = noop;
	}
};

initMethods.call(Logger.prototype);


module.exports = Logger;