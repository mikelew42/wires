// meant to be attached to Constructor, so this === Constructor
var setup = function(parent, name){
	name = name[0].toLowerCase() + name.substring(1);
	// parent is the new instance that this Constructor is attached to
	// for example, if Mod.prototype.Sub, and Sub has a .setup fn,
	// then parent would be the new mod instance

	// the key is just the ClassName with the first letter lowercased --> className
	parent[name] = new this({
		name: name,
		parent: parent
	});

	// override this to change prop name and parent reference name, ex:
	// parent.whatever = new this({ whatever: this });
};

module.exports = setup;