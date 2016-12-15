var eventedAssign = function(){
	// allow multiple objects
	for (var i = 0; i < arguments.length; i++){
		// loop over each property
		for (var j in arguments[i]){
			// assign it to this
			this[j] = this.applyFilter("assign", arguments[i][j], j);
		}
	}
	return this;
};

module.exports = eventedAssign;