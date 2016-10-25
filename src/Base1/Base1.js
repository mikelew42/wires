var assign = function(){
	// allow multiple objects
	for (var i = 0; i < arguments.length; i++){
		// loop over each property
		for (var j in arguments[i]){
			// assign it to this
			this[j] = arguments[i][j];
		}
	}
	return this;
};

var createConstructor = function(){
	var Base1 = function(){
		if ( !(this instanceof Base1) )
			return new Base1.bind.apply(Base1, prepArgsForConstructor(arguments));

		this.create.apply(this, arguments);
	};

	Base1.assign = assign;
	Base1.prototype.assign = assign;
};

var Base1 = createConstructor();
Base1.assign({

})

/*

The only way to have the instanceof check, is if we create a new constructor that binds to itself...

It doesn't have to necessarily have a specific name:

createConstructor: 

	eval("var " + name + ";");
	var constructor = eval("(" + name + " = function " + name + "(o){\r\n\
	if (!(this instanceof " + name + "))\r\n\
		return new (" + name + ".bind.apply(" + name + ", prepArgsForConstructor(arguments)));\r\n\
	this.create.apply(this, arguments);\r\n\
});");
	constructor.assign = assign;
	constructor.prototype.assign = assign;
	return constructor;

*/