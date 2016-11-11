var Base3 = require("../Base3/Base3");
var is = require("../is");

var Property = Base3.extend({
	value: undefined, // <--- this is where the value is stored
	set: {
		// for new Mod({ propName: "value" }), this doesn't get triggered...
		// this is only for Mod.extend({ PropName: "value" })
		other: function(prop, value){
			// prop is always a prototype here?
			prop.setter(value);
		}
	},
	init: function(){
		if (this.parent)
			this.install();
	},
	install: function(){
		// if each prototype gets a new instance (we're not trying to share these properties all the way down the food-chain, like normal props?)
			// no, I don't think that's smart
			// so, in some rare instances, when you're trying to use that fallback feature to return a property to its default,
			// these props will work slightly different to normal props
			// if you absolutely need that feature, you would have to rewrite this...
		var prop = this;
		Object.defineProperty(this.parent, this.name, {
			get: function(){
				return prop.getter();
			},
			set: function(value){
				prop.setter(value);
			}
		});

		this.parent.props = this.parent.props || {};
		this.parent.props[this.name] = this;
	},
	getter: function(){
		return this.value;
	},
	setter: function(value){
		this.value = value;
	}
}).assign({
	setup: function(parent, name){
		name = name[0].toLowerCase() + name.substring(1);
		// don't assign it, as with a normal property
		new this({
			name: name,
			parent: parent
		});
	}
});

module.exports = Property;