var is = require("../is");
var View = require("../core/View");
var Route = require("../core/Route");
var router = require("../router");
var utils = require("../utils/utils");

var $ = require("jquery");

var Page = View.extend({
	name: "Page",
	init: function(){
		this.pathname = utils.sanitizeString(this.name);
		this.init_route();
		// this.render();
	},
	init_route: function(){
		var page = this;
		this.route = new Route({
			pathname: utils.sanitizeString(this.name),
			label: this.name
		}).then(function(){
			$(function(){
				page.render();
			});
		}).andThen(function(){
			page.unrender();
		});

		router.addRoutes(this.route);
	},
	render: function(){
		this.$el = $("<div>").addClass("page-"+this.pathname).appendTo("#docroot");

		this.$title = $("<h1>").text(this.name).appendTo(this.$el);
	},
	unrender: function(){
		if (this.$el){
			this.$el.remove();
		}
	}
});

module.exports = Page;