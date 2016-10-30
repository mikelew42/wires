var Base3 = require("../Base3/Base3");
var View = require("../core/View");
require("font-awesome-webpack");
var Icon = require("./Icon");
require("./styles.less");
var is = require("../is");

var Item = module.exports = View.extend({
	name: "Item",
	classes: "item flex pad-children",
	Icon: Icon,
	icon: "folder",
	set: new Base3.Set({
		str: function(item, str){
			item.name = str;
		}
	}).fn,
	inst: function(){
		this.icon = new this.Icon({
			autoRender: false,
			parent: this
		});
	},
	init: function(){
		// must init_icon before auto render!
		this.init_icon();
		this.init_value();

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
	init_value: function(){
		// does not show, by default
		if (is.def(this.value)){
			this.value = new View({
				autoRender: false,
				classes: "value",
				content: this.value
			})
		}
	},
	content: function(){
		// Icon("plane");

		// set icon: false to skip
		if (this.icon){
			this.icon.render(); // .addClass("pad-self");

			// encapsulate the addClass part
			// make the icon a getSet super function, "binding" it to the Item view instance
			// then, in the "getter" switch (inside .main), do a "capture me" call
			// the getter just returns the icon type, but could also let you simply write:
			// this.icon();

			// and also, maybe auto-instantiate all of the sub views, and allow .set --> pass the { icon: "type" } directly to the .icon view, so you don't have this wonky "set icon to a string, then have it convert to a view" 
		}

		View({ classes: "name" }, this.name);

		if (this.value){
			this.addClass("has-value");
			this.value.render();
		}
	}
});

/*

Icon by default?
Item("name only") --> uses default icon?
or
Item({
	name: "Name only" --> uses default icon, because we didn't clobber the .content fn
});





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