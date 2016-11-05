var inst = function(){
	for (var i in this){
		if (i === "constructor")
			continue;
		if (this[i] && this[i].setup)
			this[i].setup(this);
	}
};

module.exports = inst;