// require("./Lorem");
// require("test");
// require("./styles.less");

// require("log42/logger2.tests.js");

var Application = require("Application");

var app = new Application({
	log: true,
	name: "app",
	load_pages: function(){
		var pages = require.context("./root/", true, /\.page\.js$/);
		// console.log("pages", pages.keys());
		this.require_all(pages);

		var other_pages = require.context("./pages/", true, /\.page\.js$/);
		this.require_all(other_pages);
	},
	load_tests: function(){
		var app = this;
		var tests = require.context("./", true, /\.tests\.js$/);

		this.test_routes(tests);

		this.router.addRoutes(new this.Router.Route({
			pathname: "/test/",
			label: "Tests"
		}).then(function(){
			app.require_all(tests);
			app.router.render_nav();
		}));
	},
	test_routes: function(requireContext) {
		var keys = requireContext.keys(), key;
		// console.log(keys);
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
				// console.log("require " + this.key);
				requireContext(this.key);
			}));
		}
		// keys.forEach(context); 
	}
});

app.start_time = Date.now();