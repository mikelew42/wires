var is = require("../is");


//  Ug.. some complications with this, just going to try and keep Class.Sub and Class.prototype.Sub in sync.
var sub = module.exports = function(){
	var arg;
	for (var i = 0; i < arguments.length; i++){
		arg = arguments[i];
		for (var j in arg){
			if (is.Class(this[j]))
				this[j] = this[j].extend(arg[j])
		}
	}
};