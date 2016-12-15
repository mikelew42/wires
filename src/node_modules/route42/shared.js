module.exports = {
	cleanPathParts: function(pathParts){
		if (pathParts[0] === "")
			pathParts = pathParts.slice(1);

		if (pathParts[pathParts.length - 1] === "")
			pathParts = pathParts.slice(0, -1);

		return pathParts;
	},
	parts: function(path){
		return this.cleanPathParts(path.split("/"));
	}
};