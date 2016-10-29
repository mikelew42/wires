var Base2 = require("../Base/Base2");
var create = require("./create");
var Set = require("./Set");

var Base3 = module.exports = Base2.extend({
	name: "Base3",
	create: create,
	set: new Set().fn
}).assign({
	Set: Set // for easy reference
});