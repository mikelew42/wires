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
			item.label.set(str);
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

		this.label = new View({
			autoRender: false,
			addClass: "label",
			content: "Item",
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
		this.label.render();
		this.value.render();
	}
});

/*

new View({
	addClass: "item",
	content: function(){
		this.icon = new Icon("beer"); // if those below aren't captured, how do we make this get captured?
		this.value = new View(123 || "xyz");
	}
})

new View({
	addClass: "item",
	icon: Icon("beer"), // how do we prevent these from getting captured?
	value: View(123 || "xyz"),
	content: function(){
		this.icon.render();
		this.value.render();
	}
});

Predefining views is most useful for defining a Class:

Item = View.extend({
	addClass: "item",
	icon: Icon("beer"), // vs
	Icon: Icon.extend("beer"); // and then, autoInstantiate through some kind of "install" or "attach" hook/fn?
});


*/