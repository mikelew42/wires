var ExtendModFn = require("./ExtendModFn");
var track = require("../track/track");
var createConstructor = require("../Base3/createConstructor");

var ExtendModFn2 = ExtendModFn.extend({
	setupConstructor: function(Ext, Base){
		Ext.assign(Base);
			Ext._events = {};
			track(Ext);
		Ext.base = Base;
	},
	setupPrototype: function(Ext, Base, args){
		Ext.prototype.set.apply(Ext.prototype, args);
	},
	createConstructor: function(name){
		return createConstructor(name);
	}
});

module.exports = ExtendModFn2;
/*
How do we modify extend before extending?

Extend is a Class.Extend sub class...

Mod = Module.extend({
	Extend: {
	
	} // certain properties could get plucked and extended on the Class, rather than prototype...
	
});


How would that work?

In Module.extend, we check if there's an Extend property.
If there is, we... extend Module.Extend, create a new instance, use that instance's .fn and apply it to Module, as if we temporarily swapped out Module.extend

Do we always want that?
What if we just want the next class to have the new Extend?
It depends on what you're upgrading...
Non-breaking changes shouldn't matter - if you're adding conditional upgrades.
 --> If you need the upgrades during the immediate extend, which i suppose you might, then it would be best to have this immediate use of the new extend
 --> If you're making breaking changes, and you don't want it, maybe you can use assign, and do it manually later...?  


Auto Instantiation

Module.autoInstantiate()
	Loop through all props.  If we find a Sub class, check if it has .autoInstantiate = true;

	If so, using its instanceName property, check the Module to see if Module[instanceName] instanceof Sub, and if hasOwn?

	If the Module.Sub was extended, and Module.sub wasn't re-instantiated, then it shouldn't be an instance of Module.Sub.

		If not, we need to reinstantiate

This allows us to Extend a Class, and if its setup for autoInstantiation, we'll automatically upgrade the instance as well.


*/