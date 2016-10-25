var track = require("./track");
var create = module.exports = function(o){
	track(this);
	this.assign.apply(this, arguments);
	this.init && this.init();
};