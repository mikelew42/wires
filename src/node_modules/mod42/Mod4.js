var Mod1 = require("./Mod1");
var track = require("track");
var is = require("is");

/*
If the child is unique, which based on this parenting check, then the name should always be accurate.

If that's the case, then we can just skip this whole swap business, and let the child re-install itself on the parent.


Also, rather than looping through all properties, and doing a bunch of conditionals on each one of them, here's a potential optimization:
1) Loop through all properties, 1 time, and store them in secondary property arrays/sets, based on conditionals?  Ugh, nevermind, that does the same work...

But, if you wanted to do them in order, for example, cloning all arrays first, then that might be a good idea. (Clone the arrays first, so you can be sure to skip auto cloning that property that references the same item).

Problem with child references in several arrays:  How do we handle this situation?  Well, the child to be cloned should be tracked, and if it appears again, we should have a reference to its clone, to put in its place.  So, maybe we do need to do a little tracking...




Another problem with this auto cloning:  when we're overriding a sub module in .set, and we auto clone the module that's about to be overridden anyway, we're doing more work.

For example:

Module with .sub
new Module({
	sub: new Sub()
})

In this case, Module will instantiate, auto clone its prototype's .sub, which gets trashed a second later, when this incoming .set({sub}) overrides it.

A potential workaround for that, is to protect after .set?

That's how I was doing it before... if !hasOwn, then auto clone.  That way, if we .set({ sub: .. }) and THEN .protect(), then we're able to skip redundant cloning.
That let's the user override something, and 


*/
var cloneArray = function(arr, parent, swap, arrName){
	var clone = [];
	var value;


	for (var i = 0; i < arr.length; i++){
		value = arr[i];
		if (value && value.clone && value.parent && value.parent === parent.proto){
			swap.push({
				index: i,
				name: value.name,
				arrName: arrName
			});
		} else {
			clone[i] = arr[i];
		}
	}

	return clone;
}
/*
Problem:  When trying to assign a reference that by chance hasn't been adopted yet, it gets adopted incorrectly...

Also, I was thinking today there's another big problem with this array cloning scheme... Can't remember though
*/
var Mod4 = module.exports = Mod1.extend({
	name: "Mod4",
	set: {
		stdProp: function(mod, prop, value){
			mod[prop] = value;

			if (value && is.fn(value.setup) && prop !== "parent")
				value.setup(mod, prop);
		}
	},
	instantiate: function(){
		this.set.apply(this, arguments);
		this.protect();
		this.initialize.apply(this, arguments);
	},
	protect: function(){
		var prop, clones = [], swap = [];
		for (var i in this){
			if (["constructor", "base", "proto", "parent"].indexOf(i) > -1)
				continue;
			if (this.hasOwnProperty(i))
				continue;
			prop = this[i];
			if (prop && prop.clone && prop.parent && prop.parent === this.proto){
				this[i] = prop.clone({
					parent: this,
					name: i
				});
				clones.push(i);
			} else if (is.arr(prop)){
				this[i] = cloneArray(prop, this, swap, i);
			}
		}

		// basically, this.something = childMod that gets cloned
		// and, this.arrName[index] === this.something
		// and we need to swap out that index for the new clone...  :/
		for (var i = 0; i < swap.length; i++){
			if (clones.indexOf(swap[i].name) > -1){
				this[swap[i].arrName][swap[i].index] = this[swap[i].name];
			}
		}
	},
	clone: function(){
		var clone = Object.create(this);
		track(clone);
		clone.proto = this;
		clone.instantiate.apply(clone, arguments);
		return clone;
	}
});

// auto adopt
// leave .setup on the Mod, and use an autoAdopt flag?
	// that allows any Mod to get adopted by simply setting the flag
	// but, its just as easy to use Mod.Sub()...
Mod4.Sub = Mod4.extend({
	name: "Sub",
	setup: function(parent, name){
		if (parent && !this.hasOwnProperty("parent")){
			this.parent = parent;
		}

		if (name && !this.hasOwnProperty("name")){
			this.name = name;
		}
	}
})