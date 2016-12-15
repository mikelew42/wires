Multiple approaches to rendering:
- capturing:  call the render fn (or just make a new auto-rendering object) within a capturing function
	--> this should basically just call capturingObject.add(newObj);
	--> we can separate auto-render and capture:  a new object can be captured independently of whether or not its rendered.


Use this.add({
	named: new Something()
});

In order to add something with a name...?

Or, just do it automatically with the "name" property:

new Something({
	name: "something" // by default
	autoAdopt: true // default, set something.parent = this
	autoReference: true // default, set parent[this.name] = this;
});

When you're not using a context, its ok to drop the "new", and even to name your constructors lower cased, to be a real hipster.

hipster("view");

h("h1.class-one.two.three", "Content");
h("h1.classes", this.prop("title"));