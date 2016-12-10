// var TestFramework = require("../test/framework");
// var test = TestFramework.test;
// var assert = console.assert.bind(console);
var test = require("test42");
var is = require("../is");
var $ = require("jquery");
var view = require("view42");

var Router = require("./Router");


test("Router", function(){

	var router = Router({
		log: true
	});

	router.add("one");
	router.one.add("two").then(function(){
		console.log("matched", this.path);
	});

	router.add("test").add("route42").add("Router").add("one").then(function(){
		console.log("one activated");
	}).andThen(function(){
		console.log("one deactivated");
	});
	router.test.route42.Router.add("two").then(function(){
		console.log("two activated");
	}, function(){
		console.log("two deactivated");
	});
	// router.one.two.activate();

	router.matchAndActivate(); // must be manually triggered when all routes have been added...

		view({
			tag: "button",
			content: function(){
				this.append("one");
				this.click(function(){
					router.test.route42.Router.one.activate();
				}.bind(this));
			}
		});

		view({
			tag: "button",
			content: function(){
				this.append("two");
				this.click(function(){
					router.test.route42.Router.two.activate();
				}.bind(this));
			}
		});

});

