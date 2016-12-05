require("./Lorem");
// require("test");
// require("./styles.less");

// require("log42/logger2.tests.js");
var logger = require("log42");
// logger.on();
var log = logger();

var $ = require("jquery");
$(function(){
	log.groupc("document.ready");
	$(function(){
		$(function(){
			log.end();
			console.info("time to ready", Date.now() - app.start_time);
		});
	})

});

var Application = require("Application");
var App = require("app42");

var app = new Application({
	// log: true,
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

var test = require("test42");

var app2 = new App({
	// log: true,
	name: "app2",
	load_tests: function(){
		var app2 = this;
		var tests = require.context("./", true, /\.tests\.js$/);

		this.test_routes(tests);

		this.router.add("test").then(function(){
			app2.require_all(tests);
			// re-render nav?
		});
	},
	test_routes: function(requireContext) {
		var keys = requireContext.keys(), key;
		console.log(keys);
		for (var i = 0; i < keys.length; i++){
			key = keys[i].replace("./", "").replace(".tests.js", "");

			this.router.add({
				name: key,
				label: key,
				key: keys[i],
				allowDefault: true,
				matchBeginning: true
			}).then(function(){
				// console.clear();
				// console.log("require " + this.key);
				requireContext(this.key);
			});
		}
		// keys.forEach(context); 
	}
});

app.start_time = Date.now();