var ModFn = require("../ModFn/ModFn");
var is = require("../is");

var Set = module.exports = ModFn.extend({
	main: function(mod){
		var args = this.args(arguments); // chop off the first arg
		for (var i = 0; i < args.length; i++){
			this.arg(mod, args[i]); // keep mod as first arg
		}
		return mod; // important
	},
	arg: function(mod, arg){
		if (is.obj(arg))
			this.obj(mod, arg);
		else if (is.str(arg) && this.str)
			this.str(mod, arg);
		else if (is.num(arg) && this.num)
			this.num(mod, arg);
		else if (is.bool(arg) && this.bool)
			this.bool(mod, arg);
		else if (is.undef(arg) && this.undef)
			this.undef(mod, arg);
		else if (is.fn(arg) && this.setFn)
			this.setFn(mod, arg); // .fn is taken..
		else if (this.other)
			this.other(mod, arg);
		else
			console.warn("not sure how to set this", arg);
	},
	obj: function(mod, obj){
		for (var i in obj){
			if (is.undef(mod[i])){
				this.stdProp(mod, obj, i);
			} else if (mod[i].set) // dependent on is.def(mod[i])
				mod[i] = mod[i].set.call(mod[i], obj[i]); // usually will just reset itself, but allows .set to return something new, like an extended ModFn, for example
			else if (is.fn(mod[i]))
				this.fnProp(mod, obj, i);
			else
				this.stdProp(mod, obj, i);
		}
	},
	stdProp: function(mod, obj, i){
		mod[i] = obj[i];
	},
	fnProp: function(mod, obj, i){
		if (is.fn(obj[i])){
			this.stdProp(mod, obj, i);
		} else {
			if (is.arr(obj[i])){
				mod[i].apply(mod, obj[i]);
			} else {
				mod[i].call(mod, obj[i]);
			}
		}
	}
});