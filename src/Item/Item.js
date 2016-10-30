var Base3 = require("../Base3/Base3");
var View = require("../core/View");
require("font-awesome-webpack");
var Icon = require("./Icon");
require("./styles.less");

var Item = module.exports = View.extend({
	name: "Item",
	classes: "item",
	Icon: Icon,
	icon: "folder",
	init: function(){
		// must init_icon before auto render!
		this.init_icon();

		this.init_view();
	},
	init_icon: function(){
		// set icon: false to skip
		if (this.icon){
			this.icon = new this.Icon({
					autoRender: false,
					parent: this
				},
				this.icon
			);
		}
	},
	content: function(){
		// Icon("plane");

		// set icon: false to skip
		if (this.icon)
			this.icon.render();

		View({ classes: "title" }, this.name);
	}
});

/*

Two use cases:  On-the-fly views, and Reusable views

When you're writing a post, or some arbitrary content, you don't want to have to... extend a new class, create an instance, assign sub views, rewrite a render function, etc etc...

You just want to do something like this:

Post(Title("Yo"), Content("Yea")); // for example


If you're creating an Item view that needs to be quite versatile, and handle many cases, you'll probably want to create properties, and pre-render them before the "content" function runs.  There might not even be a content function for some views...

There might be several capturable content areas for





Always use Capital for constructor - don't get fancy...

this.icon.render() --> uses an existing instance
this.Icon() --> creates a new instance

probably should use "new", just in case you're nesting views:

new this.Icon()

in the constructor "new" check:
you could use a if (this.created) return new ... 


Item({
	preview: function(){
		Icon("whatever");
		Title(this.prop("name"));
		Value(this.prop("value"));
	},
	content: function(){
		this.render_children();
	}
})

what about:

Item({
	icon: "beer",
	name: "MODULES",
	click: "activate"
})


Predefined subviews vs on-the-fly capture groups...

And, a mixture of the two?

If we predefine item.icon to be "the" icon, but we want to modify the view:

Item({
	icon: "beer",
	preview: function(){
		ExpandBtn(this);
		this.icon.render() || this.icon()?

	}
})

*/