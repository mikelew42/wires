var Mod2 = require("./Mod2");
var track = require("track")

var Mod3 = module.exports = Mod2.extend({
	name: "Mod3",
	instantiate: function(o){
		this.protect();
		this.inst && this.inst();
		this.set.apply(this, arguments);
		this.initialize();
	},
	// this should be accompanied by an autoClone flag...
	// we'll want to be able to have prototype instances that aren't auto cloned...
	protect: function(){
		for (var i in this){
			if (["constructor", "base", "proto", "parent"].indexOf(i) > -1)
				continue;
			if (this[i] && this[i].clone && !this.hasOwnProperty(i) && this[i].autoClone){
				this[i] = this[i].clone({
					parent: this
				});
			}
		}
	},
	setup: function(parent, name){
		// this will run whenever an instance is simply added to another...
		// it might just be a reference
		if (!this.parent)
			this.parent = parent;

		if (!this.name)
			this.name = name;
	},
	clone: function(){
		var clone = Object.create(this);
		track(clone);
		clone.instantiate.apply(clone, arguments);
		return clone;
	}
});