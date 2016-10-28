var Route = require("../core/Route");
var router = require("../router");
var TestFramework = require("./framework");

var createTestRoutes = function(requireContext) {
	var keys = requireContext.keys(), key;
	for (var i = 0; i < keys.length; i++){
		key = keys[i].replace("./", "").replace(".tests.js", "");

		router.addRoutes(new Route({
			pathname: "test/" + key,
			label: key,
			key: keys[i],
			allowDefault: true,
			matchBeginning: true
		}).then(function(){
			// console.clear();
			requireContext(this.key);
		}));
	}
	// keys.forEach(context); 
};

var requireContext = require.context('../', true, /\.tests\.js$/);

createTestRoutes(requireContext);

var runAllTests = function(){

};

router.addRoutes(new Route({
	pathname: "/test/",
	label: "/test/",
	allowDefault: true
}).then(function(){
	runAllTests();
}));