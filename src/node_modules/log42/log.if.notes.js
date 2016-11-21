if (log.if_fn(function(){
	// makes a group, and you can log whatever you want in here...
	log("a > b", a > b);
})){
	log.then_fn(function(){

	})
}

// or

log.if(function(){

}).then(function(){

}).else_if(function(){

}).then(function(){

}).else(function(){

}).then(function(){

});

// but, making a function for every simple condition is a little verbose

log.if(a > b).then(function(){
	// log the "if (<value>)" group as green or red.  this is the group's contents
}).else_if(c < d).then(function(){

}).else(function(){

}); // else can do the "end"

log.if(a > b).then(funciton(){

}).end(); // we don't know if there will be more else_ifs or elses

// and, for complex conditions:
log.if_fn(function(){
	// we need to make the group immediately, and don't know the return value...
	// there should be one group for the condition and the outcome...
}).then(function(){

}).end();



// old Log.tests.js
var logger = require("log42");
var log = logger() || logger(false);

var log = logger({
	Method: {}, // auto extend default Method sub class
	methods: {
		methodName: {
			// auto extend, or extend default Method
		}
	}
});

var Logger = logger.Logger; // access to the actual Logger class.


var my_function = function(){
	var log = logger() || logger(false);
};

// attached to a module:

var Mod = Module.extend({
	some_method: function(){
		this.log(this) && this.log(that);
		this.log.on() && this.log.off();
		this.log.host === this;
		this.log.methods.methodName = false;
		this.log.methods.methodName = this.log.Method.extend();
		this.log.set({
			methods: {
				methodName: {
					// auto extend
				}
			}
		});

		// this is cleaner:
		this.log.methods.set({ // special "set"
			methodName: {
				// auto extend, even if nothing is there...
			}
		});


	}
});

// old Log.js
var Base3 = require("Base3");
var is = require("is");

var Logger = Base3.extend({
	name: "Logger",
	get_logger: function(){
		// build a logger or noop logger, depending on input
		return log;
	}
});

module.exports = function(){
	var logger = Logger.apply(null, arguments);
	return logger.get_logger();
};

module.exports = function(){
	var Loggr = Logger.extend.apply(Logger, arguments);
	var logger = Loggr();
	var log = logger.get_logger();
	log.logger === logger;
	log.Logger === Loggr;

	log.setup(parent, name){
		if (!parent.hasOwnProperty(name)) // I don't see how it could, when run immediately upon .create.  But, if setup is reused later?  But, that would be for a new instance...
			parent[name] = parent[name].clone();
		log.parent = parent;
	}

	log.clone(newParent){

	}
};


var Mod = Module.extend({
	log: logger()
});
// --> log needs "this"...
// --> we need a Mod.setup?
// we could use something like that .setup system... 
inst: function(){
	for (var i in this)
		if (this[i].setup)
			this[i].setup(this, i);
}


var log = Logger().log;
log === console.log.bind(console);
log.log = console.log.bind(console);
log.consoleMethods = console.consoleMethods.bind(console);
log.method({opts});
log.on(); // --> swaps them back
log.off(); // --> swaps out all methods to noop;

log.methods.set;
	// auto extend, use default log.Method if it doesn't exist