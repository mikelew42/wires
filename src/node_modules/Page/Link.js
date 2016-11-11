var View = require("../View/View");
var $ = require("jquery");

var Link = module.exports = View.extend({
	tag: "a",
	addClass: "link",
	name: "Link",
	active: true,
	render: function(){
		this.get_captured();

		if (this.page)
			this.route = this.page.route;

		if (!this.route)
			console.warn("no route on this Link");

		this.$el.attr("href", this.route.pathname).html(this.route.label).click(this.clickHandler.bind(this));
	},
	clickHandler: function(e){
		// console.group(this.route.label + " click handler");
		if (!this.route.allowDefault){
			e.preventDefault();
			this.route.activate();
		}
		// console.groupEnd();
	}
});