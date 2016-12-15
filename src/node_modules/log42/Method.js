var Mod1 = require("mod42/Mod1");
var is = require("is");
var logger = require("log42");

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
var getParamNames = function(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  return result || [];
}

logger.off();

var Method = module.exports = Mod1.extend({
	name: "Method",
	// log: false,
	set: {
		log: false
	},
	suppress: true,
	enabled: true,
	disabled: false,
	expand: true,
	disable_return: true,
	args: "names",
	max_obj_props: 2,
	// argLabel: "",
	enable: function(value){
		if (value === false){
			this.enabled = false;
			this.disabled = true;
		} else {
			this.enabled = true;
			this.disabled = false;
		}
	},
	disable: function(value){
		if (value === false){
			this.disabled = false;
			this.enabled = true;
		} else {
			this.disabled = true;
			this.enabled = false;
		}
	},
	init: function(){
		// if (this.name === "assign")
		// 	debugger;
		this.argNames = getParamNames(this.method || function(){});
	},
	wrapper: function(){
		var methodLogger, wrapped;

		if (this.disabled)
			return this.method;

		methodLogger = this;

		wrapped = function(){
			return methodLogger.execWrapper(this, arguments);
		};

		for (var i in this.method){
			wrapped[i] = this.method[i];
		}

		wrapped.wrapped = true;
		wrapped.method = this;
		wrapped.fn = this.method;

		if (this.method.set){
			wrapped.set = function(){
				return this.fn.set.apply(this.fn, arguments);
			};
		}
		return wrapped;
	},

	execWrapper: function(ctx, args){
		// TODO: suppress if method is turned off...
		// if (this.name === "assign")
		// 	debugger
		return this.logAndExecMethod(ctx, args);
	},

	logAndExecMethod: function(ctx, args){
		var log, ret, restore;

		if (this.disabled){
			return this.method.apply(ctx, args);
		}
		
		// can we use method.log = t/f to control this?
		// which takes precendence?

		// can we confgure a method to suppress or amplify all contained logs, without actually wrapping self?
			// if suppressing, then you probably wouldn't just want a wrapper...
			// if amplifying, you'd most likely want the wrapper

		// log wrapper --> auto, true, false
		// suppress/amplify --> auto, true, false

		// ctx.log [auto/t/f] is a general setting for that whole module
		// this method.log [a/t/f] can be generic for ALL method wrappers, or for any scope, including a specific method.
		// if its a specific method, then maybe we want to listen to that over the more general setting?
			// just use ctx for now

		if (ctx.log && ctx.log.override){
			restore = true;
			ctx.log.override();
			log = ctx.log;
		} else {
			log = this.log;
		}

		// open group
		if (this.expand)
			log.group.apply(console, this.methodLabel(ctx, args));
		else
			log.groupc.apply(console, this.methodLabel(ctx, args));

		// capture return value
		ret = this.method.apply(ctx, args);
		
		// close group
		this.ret(ret, ctx, log);

		if (restore)
			logger.restore();
		return ret;
	},

	methodLabel: function(ctx, args){
		// a wrapped method can be anywhere on a prototype chain, and be called by many different ctx
		var id = is.proto(ctx) ? ("prototype><" + ctx.id) : ctx.id;
		if (ctx.name){
				this.tmpName = ctx.name + "<" + id + ">" + "." + this.name;
		}
		return this.fnLabel(ctx, args);
	},

/*
Object.create will hide all props from showing in the inline logs
Then, copy them back to show them.

if is obj, use Object.create and show id, name, ..?
	even check this.args[argName] = {} for config
	and args[argName].show = ["id", "name", "importantProp"]

Use a default max_obj_props to limit the length of the object props that show
Also, you could check the length of the prop name, and the value, and use a max_char_length for object props.  If you use args.argName.show = ["reallyLongPropName"], with a long value, one of these settings should prevail (not sure which)..  I suppose the specificity should prevail.

if is Class, just use Class.name + {id}

*/
	arg_label: function(arg, label){
		if (this.literal_arg_values){
			label.push(arg);
		} else {
			if (is.Class(arg)){
				label.push(arg.name + "<" + arg.id + ">");
			} else if (is.fn(arg)){
				label.push("fn");
				if (arg.name)
					label.push(arg.name);
			} else if (is.obj(arg)){
				this.arg_label_obj(arg, label);
			} else {
				label.push(arg);
			}
		}
	},

	arg_label_obj: function(obj, label){
		var clone = Object.create(obj);
		var count = 0;
		if (obj.id){
			count++;
			Object.defineProperty(clone, "id", {
				value: obj.id
			})
			// clone.id = obj.id;
		}
		if (obj.name){
			count++;
			Object.defineProperty(clone, "name", {
				value: obj.name
			})
		}
		if (count < 1){
			for (var i in obj){
				if (i === "id" || i === "name" || i === "constructor")
					continue;

				if (!is.simple(obj[i]) && !is.fn(obj[i]))
					continue;

				if (is.fn(obj[i])){
					clone[i] = "<fn>";
				} else {
					clone[i] = obj[i];
				}
				
				
				count++;
				
				if (count >= 2)
					break;
			}
		}
		label.push(clone);
	},

	fnLabel: function(ctx, args){
		var name = this.tmpName || this.name || "anonymous";
		var argNames = this.argNames;

		var label = [ name + "(" ], argName;

		var arg;

		if (is.def(this.argLabel)){
			label.push(this.argLabel);
		} else if (argNames.length){

			// build argName: argValue, ...
			for (var i = 0; i < argNames.length; i++){
				argName = argNames[i];
				arg = args[i];

				if (argName)
					label.push(argName+":");
				
				this.arg_label(arg, label);

				if (i < argNames.length - 1){
					label.push(",");
				}
			}

			// add additional anonymous arguments
			if (i < args.length){
				label.push(",");
				for (i; i < args.length; i++){
					this.arg_label(args[i], label);
					if (i < args.length - 1)
						label.push(",");
				}
			}

		// the function defines no args, these are all anonymous args
		} else if (args.length){
			for (var j = 0; j < args.length; j++){
				this.arg_label(args[j], label);
				if (j < args.length - 1)
					label.push(",");
			}
		}
		label.push(")");
		return label;
	},

	ret: function(retValue, ctx, log){
		if (this.disable_return){
			log.end();
			return false;
		}
		if (is.fn(retValue)){
			retValue = retValue.toString().split("<")[0];
		}

		if (retValue === ctx){
			log.end();
			return false;
		}

		// this.contain can be undefined/"auto", true, or false
		if (!is.def(this.contain) || this.contain === "auto"){
			// log return value after the group
			if (is.def(retValue)){
				log.end();
				log("  return", retValue);
			// or not at all
			} else {
				log.end();
			}
		} else if (this.contain === true){
			log("return", retValue);
			log.end();
		} else if (this.contain === false){
			log.end();
			log("  return", retValue);
		}

	}
});

logger.restore();