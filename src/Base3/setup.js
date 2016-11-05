// mean to be attached to Constructor, so this === Constructor
var setup = function(parent){
	// parent is the new instance that this Constructor is attached to
	// for example, if Mod.prototype.Sub, and Sub has a .setup fn,
	// then parent would be the new mod instance

	// the key is just the ClassName with the first letter lowercased --> className
	parent[this.name[0].toLowerCase() + this.name.substring(1)] = new this({
		parent: this
	});

	// override this to change prop name and parent reference name, ex:
	// parent.whatever = new this({ whatever: this });
};

module.exports = setup;