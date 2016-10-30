var Base3 = require("../Base3/Base3");
var View = require("../core/View");
require("font-awesome-webpack");
var Icon = require("./Icon");
require("./styles.less");
var is = require("../is");

var Item = module.exports = View.extend({
	name: "Item",
	addClass: "item flex pad-children",
	Icon: Icon,
	icon: "folder",
	set: {
		str: function(item, str){
			item.name = str;
		}
	},
	inst: function(){
		this.icon = new this.Icon({
			// defaults
			type: "folder",
			autoRender: false,
			// parent: this
		});

		this.value = new View({
			autoRender: false,
			active: false,
			addClass: "value",
			set: {
				other: function(view, value){
					view.content = value;
					view.active = true;
				}
			}
		});
	},
	content: function(){
		this.icon.render();
		View({ addClass: "name" }, this.name);
		this.value.render();
	}
});