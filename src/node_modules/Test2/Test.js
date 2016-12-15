var Base3 = require("../Base3/Base3");
var is = require("../is");
var Page = require("../Page/Page");
var utils = require("../utils/utils");

/*
This defines the /test/ route, and also loads all .tests.js files, and creates those routes...
*/
var Test = Page.extend({
	name: "Test",
	init: function(){
		this.init_page();
		this.init_test_page();
		this.init_route();
	},
	init_test_page: function(){
		this.addClass("test-page");
	},
	init_route: function(){
		var page = this;

		this.route = this.Route({
			pathname: utils.sanitizeString(this.name)
		});
	}
});