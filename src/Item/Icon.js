var Base3 = require("../Base3/Base3");
var View = require("../core/View");
require("font-awesome-webpack");

var Icon = module.exports = View.extend({
	name: "Icon",
	tag: "i",
	classes: "icon fa fa-fw",
	set: new Base3.Set({
		str: function(icon, type){
			icon.type(type);
		}
	}).fn,
	type: function(type){
		this.$el.removeClass("fa-" + this._type).addClass("fa-" + type);
		this._type = type;
	}
});