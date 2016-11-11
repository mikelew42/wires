var View = require("./View");
var $ = require("jquery");

var Link = module.exports = View.extend({
	name: "Link",
	render: function(){
		if (!this.route)
			console.warn("no route on this Link");

		this.$el = $("<a>").attr("href", this.route.pathname).html(this.route.label).click(this.clickHandler.bind(this));
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