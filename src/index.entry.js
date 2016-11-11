require("./Lorem");
// require("test");
require("./styles.less");
var Application = require("Application");


var app = new Application({
	load_pages: function(){
		var pages = require.context("./root/", true, /\.page\.js$/);
		// console.log("pages", pages.keys());
		this.require_all(pages);

		var other_pages = require.context("./pages/", true, /\.page\.js$/);
		this.require_all(other_pages);
	},
	load_tests: function(){
		var app = this;
		var tests = require.context("./", true, /\.test\.js$/);

		this.test_routes(tests);

		this.router.addRoutes(new this.Router.Route({
			pathname: "/test/",
			label: "Tests"
		}).then(function(){
			app.require_all(tests);
		}));
	},
	test_routes: function(requireContext) {
		var keys = requireContext.keys(), key;
		for (var i = 0; i < keys.length; i++){
			key = keys[i].replace("./", "").replace(".tests.js", "");

			this.router.addRoutes(new this.Router.Route({
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
	}
});