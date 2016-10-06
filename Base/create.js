var track = require("./track");
var create = module.exports = function(o){
	track.call(this);
	this.assign.apply(this, arguments);
	this.init && this.init();
};