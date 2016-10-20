var createConstructor = require("./createConstructor");
var track = require("./track");

var extend = function(o){
	var name, Ext;

	name = (o && o.name) || (this.name + "Ext");
	
	Ext = createConstructor(name);

	// copy this.props to Ext
	Ext.assign(this);
		track(Ext);

	Ext.prototype = Object.create(this.prototype);
		track(Ext.prototype);
	Ext.prototype.constructor = Ext;
	Ext.base = this;
	Ext.prototype.type = name;

	Ext.prototype.assign.apply(Ext.prototype, arguments);

	return Ext;
};

module.exports = extend;