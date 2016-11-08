var View = require("../View/View");

var is = require("../is");
var Route = require("../core/Route");
var router = require("../router");
var utils = require("../utils/utils");
var Base3 = require("../Base3/Base3");
var Link = require("./Link");

var $ = require("jquery");


var Page2 = View.extend({
	name: "Page2",
	addClass: "page",
	autoRender: false,
	init: function(){
		this.init_page();

		// auto render
		this.init_view();
	},
	init_page: function(){
		this.init_route();
	},
	init_route: function(){
		var page = this;
		this.route = new Route({
			pathname: this.pathname || utils.sanitizeString(this.name),
			label: this.title || this.name
		}).then(function(){
			console.log("page.then");
			$(function(){
				page.render();
				page.$el.appendTo("#docroot");
				console.log("page.then --> ready");
			});
		}).andThen(function(){
			page.remove();
		});

		this.app.router.addRoutes(this.route);
	},
	link: function(){
		return new Link({
			page: this
		});
	}
});

module.exports = Page2;