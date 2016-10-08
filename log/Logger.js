var Base = require("../Base");
var is = require("../is");
var noop = function(){};
var getParamNames = require("./getParamNames");

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


var Logger = Base.extend({
	name: "Logger",
	_shouldLog: true,
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

	collapse: function(){
		// swap group to groupc
		// swap method to methodc
	},

	expand: function(){
		// swap groupc to group
		// swap methodc to method
		// cb..
		// fn
	},

	shouldLog: function(obj){
		if (is.def(obj.log))
			return obj.log; // true or false
		return this._shouldLog;
	},

	wrapMethod: function(name, fn){
		var log = this,
			argNames = getParamNames(fn),
			wrapped = function(){
				var ret;
				if (!log.shouldLog(this))
					return fn.apply(this, arguments);
				log.method(this, name, arguments, argNames);
				ret = fn.apply(this, arguments);
				log.ret(ret);
				return ret;
			};

		wrapped.wrapped = true;
		return wrapped;
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
			for (var i = 0; i < argNames.length; i++){
				argName = argNames[i];
				if (argName)
					label.push(argName+":");
				label.push(args[i]);
				if (i < argNames.length - 1){
					label.push(",");
				}
			}
		}
		label.push(")");
		return label;
	},

	ret: function(retValue){
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
			this.log("  return", retValue);
		}

	}
});

module.exports = Logger;