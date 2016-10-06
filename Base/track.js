var nextID = 0;

var track = module.exports = function(){
	this.id = ++nextID;
};