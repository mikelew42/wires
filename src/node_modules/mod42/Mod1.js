var Base = require("base42");
var SetMfn = require("./SetMfn");
var ExtendMfn = require("./ExtendMfn");
var logger = require("log42");

var set = SetMfn.make();

var Mod1 = Base.extend({
	name: "Mod1",
	set: set,
	instantiate: function(){
		this.set.apply(this, arguments);
		this.initialize.apply(this, arguments);
	},
	initialize: function(){
		this.init();
	},
	init: function(){}
}).assign({
	extend: ExtendMfn.make(),
	set: set
});

logger.install(Mod1);
logger.install(Mod1.prototype);

module.exports = Mod1;