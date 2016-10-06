var createConstructor = require("./createConstructor");
var extend = require("./extend");
var create = require("./create")


// Base constructor
var Base = createConstructor("Base");

Base.assign({
	extend: extend
});

Base.prototype.assign({
	create: create,
	init: function(){}
});

module.exports = Base;