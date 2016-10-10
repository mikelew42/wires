var Filterable = require("./Filterable");
var extend2 = require("./extend2");

var _Module = Filterable.extend({
	name: "_Module"
}).assign({
	extend: extend2.subbable,
	config: function(){
		// this.events.on("setupPrototype", function(){
		// 	console.log("Module.events.setupPrototype");
		// });
	}
});

// Call this Subbable, and then let Module be the Logged class?
// Realistically, we should be able to mixin any number of features...
// This would require heavy use of events, or code gen, or just a large number of dynamic function generators, like the extend2 pattern, only with conditional logic

var Module = module.exports = _Module.extend({
	name: "Module"
});