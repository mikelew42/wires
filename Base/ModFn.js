var is = require("../is");
var Base = require("./Base");
var argsToArray = require("./argsToArray");

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
	main: function(ctx){}
});

module.exports = ModFn;