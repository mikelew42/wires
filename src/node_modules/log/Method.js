var Base = require("../Base");
var getParamNames = require("./getParamNames");
var is = require("../is");

var Method = module.exports = Base.extend({
	name: "Method",
	init: function(){
		this.argNames = getParamNames(this.method || function(){});
	},
	wrapper: function(){
		var methodLogger = this;
			wrapped = function(){
				return methodLogger.execWrapper(this, arguments);
			};

		wrapped.wrapped = true;
		wrapped.method = this;
		return wrapped;
	},

	shouldLog: function(ctx){
		if (ctx.log.disable)
			return false;

		return !this.log.disable
	},

	execWrapper: function(ctx, args){
		// bypass logging, simply exec the underlying method
		if (!this.shouldLog(ctx))
			return this.method.apply(ctx, args);

		// TODO: suppress if method is turned off...
		
		return this.logAndExecMethod(ctx, args);
	},

	logAndExecMethod: function(ctx, args){
		// open group
		if (this.expand)
			console.group.apply(console, this.methodLabel(ctx, args));
		else
			console.groupCollapsed.apply(console, this.methodLabel(ctx, args));

		// capture return value
		ret = this.method.apply(ctx, args);
		
		// close group
		this.ret(ret);
		return ret;
	},

	methodLabel: function(ctx, args){
		if (ctx.name)
			this.name = ctx.name + "." + this.name;
		return this.fnLabel(ctx, args);
	},

	fnLabel: function(ctx, args){
		var name = this.name || "anonymous";
		var argNames = this.argNames;

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
				console.log("  return", retValue);
			// or not at all
			} else {
				console.groupEnd();
			}
		} else if (this.contain === true){
			console.log("return", retValue);
			console.groupEnd();
		} else if (this.contain === false){
			console.groupEnd();
			console.log("  return", retValue); // this.log is sometimes a function, and sometimes a module?  maybe we need to call logger instances "logger", so its logger.log(), this.logger.log(), and this.log() inside the logger.
		}

	}
});