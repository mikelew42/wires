Module.extend({
	existingProp: 5 //--> we'll auto extend the underlying Property, either before or after we integrate this new value
})

/*
This seems like a lot of work to avoid having to extend the PropName rather than propName.

Forget backwards compatibility - we just need something to work. Please.


THE PROBLEM:
We either need to always .extend({ PropName }) rather than { propName }, of figure out a way to "copy" the property instance?

What if we track the Constructor behind the scenes?

props.propName.constructor... duh

Module.extend({
	upgradedProp: 5
});
// --> check if props.upradedProp exists, if so, EXTEND ITS CONSTRUCTOR?

We really need a Props object that stores all the constructors.  Because at somepoint, we'll have to .extend the parent Module, and .extend each Property.

If we only have props, we 




What if we auto extend the property, and then let .extend call .set, and it basically gets assigned...  This works to modify the prototype.props

What happens when we re-extend?
We don't have a Constructor to create from...
We could reuse the .value... but that skips all the magic.
I'm not currently doing anything fancy with values, reassigning it might not be a bad approach.

Mod2 = Mod1.extend();
*/



/*
Just like the Logged.extend({
	Logger: {
		methods: {
			methodName: {
				config here
			}
		}
	}
});

We could use a similar pattern for props:

Module.extend({
	props: {
		existing: {
			// config here
		},
		new: {
			// auto create from default Property?
		}
	},
	props: ["one", "two"] // just upgrade these prop names to Properties?
});

The question is, how do we get this to work as usual?

Module.extend({
	upgradedProp: "new value" --> checks props for this property whenever a property is .set?
	// if it exists, we extend the Property with the new value?
})

After all, the current pattern says, "auto extend all prototype properties".  This case is no different - we need to protect the prototype.

For every prototype, and maybe every instance, we need to create an instance of the Property object.  If its ok that the property is shared, then you could have a shared Property on the prototype.  But, if you want to override it, you have to make sure to maintain that override.  It might be easier just to automatically instantiate for every .extend and every new instance.

In what order?
Module.extend
	setupConstructor
	setupPrototype
	recursiveExtend
	protectPrototype
*/