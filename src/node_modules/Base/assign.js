var assign = function(){
	// allow multiple objects
	for (var i = 0; i < arguments.length; i++){
		// loop over each property
		for (var j in arguments[i]){
			// assign it to this
			this[j] = arguments[i][j];
		}
	}
	return this;
};

module.exports = assign;