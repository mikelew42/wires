var View = require("./View");
var is = require("../is");

var Div = View.extend({
	Extend: {
		recursiveExtend: function(Ext, Base, args){
			var arg, propValue, setter, name;
			if (args.length === 2 && is.str(args[0]) && is.fn(args[1])){
				Ext.prototype.set(args[0], args[1]);
			} else {
				return this.constructor.base.prototype.recursiveExtend.apply(this, arguments);
			}
		}
	},
	set: {
		main: function(div){
			var args = this.args(arguments);
			if (args.length === 2 && is.str(args[0]) && is.fn(args[1])){
				this.strFnSpecial(div, args[0], args[1]);
			} else {
				this.constructor.base.prototype.main.apply(this, arguments);
			}
			return div;
		},
		strFnSpecial: function(div, str, fn){
			div.name = this.nameFromClasses(str);
			div.addClass(str);
			div.content = fn;
			div.active = true;
		},
		nameFromClasses: function(classes){
			// classes is string
			var classParts = classes.split(" ");
			return classParts[0];
		}
	}
});

module.exports = Div;