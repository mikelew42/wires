var track = require("../track/track");
var create = module.exports = function(o){
	track(this);
	this.assign.apply(this, arguments);
	this.init && this.init();
};