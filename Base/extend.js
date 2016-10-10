var createConstructor = require("./createConstructor");

var extend = function(o){
	var name, props, Ext, logArgs, id, protoID;

	name = (o && o.name) || (this.name + "Ext");
	
	Ext = createConstructor(name);

	id = Ext.id;
	// copy this.props to Ext
	Ext.assign(this);
	Ext.id = id;


	protoID = Ext.prototype.id;
	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.id = protoID;
	Ext.prototype.constructor = Ext;
	Ext.base = this;
	Ext.prototype.type = name;

	Ext.prototype.assign.apply(Ext.prototype, arguments);

	return Ext;
};

module.exports = extend;