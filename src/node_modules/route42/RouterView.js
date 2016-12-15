var View = require("View");
var Item = require("Item");
var Expandable = require("Expandable");

var $ = require("jquery");

var RouterView = module.exports = Expandable.extend({
	name: "RouterView",
	addClass: "router light global-router",
	autoRender: true,
	Preview: {
		content: function(){
			var routerView = this.parent;
			var router = routerView.parent;
			this.item = Item({
				icon: "code-fork",
				label: router.name
			});
		}
	},
	Contents: {
		content: function(){
			var routerView = this.parent;
			var router = routerView.parent;

			// console.log("rendering routerview contents", router, router.routes.length);

			for (var i = 0; i < router.routes.length; i++){
				router.routes[i].render();
			}
		}
	},
	rendered: function(){
		var view = this;
		$(function(){
			view.prependTo("body");
		})
	}
})