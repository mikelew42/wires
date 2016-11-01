var Base3 = require("../Base3/Base3");
var View = require("../core/View");
require("font-awesome-webpack");

var Icon = module.exports = View.extend({
	name: "Icon",
	tag: "i",
	addClass: "icon fa fa-fw",
	// autoRender: false,
	set: {
		str: function(icon, type){
			icon.type(type);
		},
		bool: function(icon, bool){
			if (bool)
				console.warn("not supported");
			else
				icon.active = false;
		}
	},
	type: function(type){
		this.$el.removeClass("fa-" + this._type).addClass("fa-" + type);
		this._type = type;
		return this;
	}
});