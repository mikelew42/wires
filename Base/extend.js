var createConstructor = require("./createConstructor");

var extend = function(o){
	var name, props, Ext, logArgs;

	name = (o && o.name) || (this.name + "Ext");
	
	Ext = createConstructor(name);

	// copy this.props to Ext
	Ext.assign(this);

	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.base = this;
	Ext.prototype.type = name;

	Ext.prototype.assign.apply(Ext.prototype, arguments);

	return Ext;
};

module.exports = extend;