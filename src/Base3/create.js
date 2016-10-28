var track = require("../track/track");
var create = module.exports = function(o){
	track(this);
	this.set.apply(this, arguments);
	this.init && this.init();
};