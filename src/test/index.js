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

var runAllTests = function(requireContext){
	requireContext.keys().forEach(requireContext); 
};

router.addRoutes(new Route({
	pathname: "/test/",
	label: "/test/",
	allowDefault: true
}).then(function(){
	runAllTests(requireContext);

	// this won't work, since we're running tests async on doc.ready...
	// var success = true;
	// try {
	// 	runAllTests(requireContext);
	// } catch (e) {
	// 	success = false;
	// 	console.error("Tests failed");
	// 	throw e;
	// }

	// if (success){
	// 	console.log("%cAll tests passed", "color: green");
	// }
}));