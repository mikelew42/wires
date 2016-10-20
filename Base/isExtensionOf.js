var isExtensionOf = module.exports = function(Base){
	var base = this.base;
	while(base){
		if (base === Base)
			return true;
		base = base.base;
	}
	return false;
}