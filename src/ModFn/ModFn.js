var is = require("../is");
var Base = require("../Base");
var argsToArray = require("../Base/argsToArray");

var ModFn = Base.extend({
	init: function(){
		this.init_fn();
	},
	init_fn: function(){
		var self = this;
		this.fn = function(){
			var args = argsToArray(arguments);
			args.unshift(this);
			return self.main.apply(self, args);
		}
	},
	main: function(ctx){
		var args = this.args(arguments); // just chops off the first argument, the ctx, so you can "apply" the args
	},
	args: function(args){
		return [].slice.call(args, 1);
	}
});

module.exports = ModFn;