var Base3 = require("../Base3/Base3");
var View = require("../core/View");
require("font-awesome-webpack");

var Icon = module.exports = View.extend({
	name: "Icon",
	tag: "i",
	classes: "icon fa fa-fw",
	set: new Base3.Set({
		str: function(icon, name){
			icon.classes = icon.classes + " fa-" + name;
		}
	}).fn
});