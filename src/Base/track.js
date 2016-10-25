var nextID = 0;

var track = module.exports = function(obj){
	obj.id = ++nextID;
};