var track = require("../track/track");
var create = function(o){
	track(this);
	this.inst();
	this.set.apply(this, arguments);
	this.init && this.init();
};

module.exports = create;