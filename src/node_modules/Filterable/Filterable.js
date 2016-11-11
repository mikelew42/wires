var Evented = require("../Evented/Evented");
var filter = require("./filter").filter;
var applyFilter = require("./filter").applyFilter;
var assign = require("./eventedAssign");

var Filterable = Evented.extend({
	name: "Filterable",
	filter: filter,
	applyFilter: applyFilter,
	assign: assign
});

module.exports = Filterable;

/*

Filters are just like functions... 

this.someFilter(value) --> returns filtered value
vs
this.applyFilter("someFilter", value) --> returns filtered value

The difference is, the event-based filter is dynamic - you don't have to edit the actual function.

You could take a dual approach:

someFilter: function(value){
	return this.applyFilter("someFilter", value);
}

This is great for dev, so you can modify the filter more easily.

However, filters probably don't need to change dynamically... It's more a matter of just finalizing a single function...



One benefit to the applyFilter approach, is that you don't cloud up the api.  For example, with .assign, we could have .assignProp(propName, newValue), which would provide an override place to do similar things to the "assign" filter.

That would work, but then you have 2 assign methods clouding the api...


*/