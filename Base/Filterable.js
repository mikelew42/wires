var Evented = require("./Evented");
var filter = require("./filter").filter;
var applyFilter = require("./filter").applyFilter;

var Filterable = Evented.extend({
	name: "Filterable",
	filter: filter,
	applyFilter: applyFilter
});

module.exports = Filterable;