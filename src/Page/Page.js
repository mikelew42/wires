var is = require("../is");
var View = require("../core/View");
var Route = require("../core/Route");
var router = require("../router");
var utils = require("../utils/utils");
var Base = require("../Base");


var $ = require("jquery");

var captor; // currently capturing view

var Captive = View.extend({
	tag: "div",
	classes: [],
	init: function(){
		this.children = [];
		this.render();
	},
	add: function(child){
		this.children.push(child);
		child.$el.appendTo(this.$el);
	},
	// separate fn for .rerender()?, and block rerender here?
	// what's an easy way to turn rendering off for an object?
	// what's an easy way to override rendering functionality, without having to override a bunch of sub modules?
	render: function(){
		var content;
		this.renderEl();
		this.captured(); // get captured by captor
		this.capture();
		content = this.content(); // then add .render() args
		if (content)
			this.$el.append(content);
		this.restore();
		return this;
	},
	captured: function(){
		if (captor)
			captor.add(this);
	},
	renderEl: function(){
		this.$el = $("<" + this.tag + ">").addClass(this.classes.join(" "));
	},
	capture: function(){
		this.previousCaptor = captor;
		captor = this;
	},
	restore: function(){
		captor = this.previousCaptor;
	}
});

var h1 = View.extend({
	tag: "h1",
	classes: ["test"],
	content: function(){
		return "This is an H1"
	}
});

var Page = View.extend({
	name: "Page",
	classes: [],
	init: function(){
		this.children = [];
		this.pathname = utils.sanitizeString(this.name);
		this.classes.push("page-" + this.pathname);
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
				page.render().appendTo("#docroot");
				// page.$el.appendTo("#docroot");
			});
		}).andThen(function(){
			page.unrender();
		});

		router.addRoutes(this.route);
	},
	content: function(){}, // override me
	unrender: function(){
		if (this.$el){
			this.$el.remove();
		}
	},
	h1: h1
});

module.exports = Page;