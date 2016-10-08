var Filterable = require("./Filterable");
var eventedAssign = require("./eventedAssign.js");
var Logger = require("../log/Logger");
var is = require("../is");
var track = require("./track");
var createConstructor = require("./createEventedConstructor");
var events = require("events");

var _log, log = _log = Logger({
	contain: true,
	collapse: true,
});

var create = function(o){
	track.call(this);
	initLogged.call(this);
	this.assign.apply(this, arguments);
	this.init && this.init();
};

var initLogged = function(){
	this.filter("assign", function(value, name){
		var log = this.log || _log;
		if (is.fn(value) && !value.wrapped){
			return log.wrapMethod(name, value);
		}
		return value;
	});
};

var Logged = Filterable.extend({
	name: "Logged",
	create: create,
	assign: eventedAssign
});

Logged.extend = log.wrapMethod("extend", function(o){
	var name, props, Ext, logArgs;

	name = (o && o.name) || (this.name + "Ext");
	
	Ext = createConstructor(name);

	// copy this.props to Ext
	Ext.assign(this); // should these be wrapped?  come back to this

	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.base = this;
	Ext.prototype.type = name;

	// enable fn wrapping, by enabling events on the prototype
	// this allows us to use the eventedAssign
	// in fact, these 3 lines of code should be a pluggable event...
		// but, we need to keep this .extend override one way or another, b/c we can't add events to the Base class
	events.call(Ext.prototype);
	Ext.prototype._events = {}; // clobber it to prevent any leakage
	initLogged.call(Ext.prototype);



	Ext.prototype.assign.apply(Ext.prototype, arguments);
	return Ext;
});


module.exports = Logged;