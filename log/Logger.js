var Base = require("../Base");
var is = require("../is");
var noop = function(){};
var getParamNames = require("./getParamNames");
var Method = require("./Method");
var Module = require("../Base/Module");

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

var Logger = Module.extend({
	name: "Logger",
	_shouldLog: true,
	Method: Method,
	config: function(){

	},
	init: function(){
		this.initMethods();
	},
	initMethods: function(){
		var method, consoleName; 
		for (var i in methods){
			method = methods[i];
			consoleName = method.consoleName || method.name;
			this[method.name] = console[consoleName].bind(console);
			this["$" + method.name] = this[method.name];
			this["x" + method.name] = noop;
		}

		this.methods = {}; // config for specific methods
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

	off: function(){
		var method;
		for (var i in methods){
			method = methods[i];
			this[method.name] = noop;
		}
		this._shouldLog = false;
	},

	on: function(){
		var method;
		for (var i in methods){
			method = methods[i];
			this[method.name] = this["$" + method.name];
		}
		this._shouldLog = true;
	},

	shouldLog: function(obj){
		if (is.def(obj.log))
			return obj.log; // true or false
		return this._shouldLog;
	},


	method: function(ctx, name, args, argNames){
		this.group.apply(0, this.buildMethodLabelArray(ctx, name, args, argNames));
	},

	methodc: function(ctx, name, args, argNames){
		this.groupc.apply(0, this.buildMethodLabelArray(ctx, name, args, argNames));
	},

	buildMethodLabelArray: function(ctx, name, args, argNames){
		if (ctx.name)
			name = ctx.name + "." + name;
		return this.buildFnLabelArray(name, args, argNames);
	},

	buildFnLabelArray: function(name, args, argNames){
		var label = [ name + "(" ], argName;
		if (argNames.length){

			// build argName: argValue, ...
			for (var i = 0; i < argNames.length; i++){
				argName = argNames[i];
				if (argName)
					label.push(argName+":");
				label.push(args[i]);
				if (i < argNames.length - 1){
					label.push(",");
				}
			}

			// add additional anonymous arguments
			if (i < args.length){
				label.push(",");
				for (i; i < args.length; i++){
					label.push(args[i]);
					if (i < args.length - 1)
						label.push(",");
				}
			}

		// the function defines no args, these are all anonymous args
		} else if (args.length){
			for (var j = 0; j < args.length; j++){
				label.push(args[j]);
				if (j < args.length - 1)
					label.push(",");
			}
		}
		label.push(")");
		return label;
	},

	ret: function(retValue){
		if (is.fn(retValue)){
			retValue = retValue.toString().split("{")[0];
		}
		// this.contain can be undefined/"auto", true, or false
		if (!is.def(this.contain) || this.contain === "auto"){
			// log return value after the group
			if (is.def(retValue)){
				console.groupEnd();
				this.log("  return", retValue);
			// or not at all
			} else {
				console.groupEnd();
			}
		} else if (this.contain === true){
			this.log("return", retValue);
			console.groupEnd();
		} else if (this.contain === false){
			this.groupEnd();
			this.log("  return", retValue); // this.log is sometimes a function, and sometimes a module?  maybe we need to call logger instances "logger", so its logger.log(), this.logger.log(), and this.log() inside the logger.
		}

	},


	wrapMethod: function(name, fn){
		var _log = this,
			argNames = getParamNames(fn),
			wrapped = function(){
				var ret,
					log = this.log || _log;
				if (!log.shouldLog(this))
					return fn.apply(this, arguments);
				if (log.expand)
					log.method(this, name, arguments, argNames);
				else
					log.methodc(this, name, arguments, argNames);

				ret = fn.apply(this, arguments);
				log.ret(ret);
				return ret;
			};

		wrapped.wrapped = true;
		return wrapped;
	},
	xwrapMethod: function(name, fn){
		return fn;
	},

	// { name, method, any other config... }
	__method: function(opts){
		// store this on .methods[name] ??  no - the logger is shared between all instances of a class, by default, and we want to be able to customize each one
		return new this.Method(
			this.methods.default, 
			this.methods[opts && opts.name] || {}, 
			opts || {}, 
			{ log: this }
		).wrapper();
	}
});


/*

Should the Logger.Method look at this.log.methods[this.name] in order to obey configuration in real time?

In fact, it could compile the method config in realtime, so you could set

Logger.Method.prototype +
logger.methods.default +
logger.methods.method +
passed in config

Examples:

logger.methods.default = {}
logger.methods.method.skip = true;
	// --> turn one method off

logger.methods.default = { skip: true }
	// --> all methods logged with this logger get skipped
	// that's just the method group, not the internal contents...
	// turning the group off might not be great, unless we can suppress internal logs...


Bleh, is this worth configuring?  I'd need a realtime way to turn ALL logging on/off, in order to suppress logs within a certain group...

If all loggers are automatically configured against a global logger, that global logger could be turned on/off, and all loggers inherit their settings in a similar way?

You could have 
globalLogger.config + 
logger.config + 
globalLogger.overrides + 
logger.overrides

Or maybe global.overrides > logger.overrides, so you could actually turn it all off

The use case here, is so you could use the default config level for most things, but then if you wanted to suppress the logging with 



Hmm, wait a second.  Instead of creating an object for each method config:

this.methods[method.name] = { simple config obj }

Does it make more sense to just extend the Method class?

Logger.methods[method.name] = Logger.Method.extend({
	simple config, or override methods...
});

Then, use these custom classes when instantiating

log.method({})
	this.constructor.methods[opts.name] ?
		--> use that constructor + opts

Each class has its own logger, so when you do:

MyModule = Logged.extend(), and the new logger appears at
MyModule.log === MyModule.prototype.log,
MyModule.Logger = MyModule.log.constructor;


***
If you MyModule = Logged.extend({
	autoWrappedMethods
}).assign({
	Logger:  Logged.Logger.extend({
		// config, etc, even
	}).assign({
		Method:
	})
});

***


and then

MyModule.Logger.methods.methodName = MyModule.Logger.Method.extend();
and you could wrap that

MyModule.Logger.method({
	name: "methodName",
	any config goes here
});


Pecking order:

creator logger
	general settings
		for all groups
	specific settings
		for all methods, or all ____
	named settings
		for [type] of a specific name

for methods (and eventually property changes), we can check "this.logger"
contextual logger
	general settings
	specific settings
	named settings

Stage 1: choose the right logger
Stage 2: let that logger do its thing

In each logger, we need to merge down these settings
logger.settings = {
	on, off
	expand, collapse
	return value in/out

	methods: {
		on/off,
		expand/collapse
	}
}

So, wrapped methods need special toggles, but all the other groups and such can just use the "x" to turn them on/off, and the "c" to expand/collapse.

logger.methods[methodName].contain --> undefined/"auto", true, false
logger.methods[methodName].expand --> undefined/false for collapse, true for expand
logger.methods[methodName].skip --> undefined/false for on, true for off

ok, so we still have logger.shouldLog()
also, would it be confusing if you customize a logger for a certain method, and then the method's object has a different logger, and does something completely different...

Maybe you could have a baseLogger and ctxLogger for each Method, and config for that method from the baseLogger and ctxLogger would be merged down, so the config from the first one doesn't disappear.

For the auto-wrapped methods using assign, we don't have access to that logger anyway...  We would need to add a custom ctx logger to the object, and customize it.

How would that look?

var loggedObj = Logged({
	autoLoggedMethodName: function(){},
	logger: new Logger({
		methods: {
			autoLoggedMethodName: "expand", "skip", 
		}
	})
});

That's kind of clunky... 


Hmm... so in any method, we'll have an "external" logger at work?  Or, inside methods, we always use:

this.logger.log("whatever");

That's kinda clunky...

we could do var log = getLogger(logger, this); // and it returns this.logger, if present, or the passed in logger, if not.  But, that's just as easy as

var log = this.logger || logger;
then 
log.log()
log.debug()
log.group()
etc...

that way, we can can normally not have a contextual logger, only if necessary?

But, we want to be able to quickly/easily turn logging on/off for the entire Class...

So, for a new Module, we extend:

var logger = new Logger() // customize

MyModule = Module.extend({
	autoLoggedMethod: function(){
		// args and return value are automatically logged
		// but we'll obviously want to log stuff in here
		var log = this.logger || logger;
	}
});

Can we link the file's logger to the .prototype.logger?

This way, every instance has a reference to it internally 



*/


module.exports = Logger;