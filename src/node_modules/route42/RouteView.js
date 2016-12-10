var View = require("View");
var Item = require("Item");
var Expandable = require("Expandable");

var RouteView = module.exports = View.AutoSub.extend({
	name: "RouteView",
	addClass: "route light",
	expand: true,
	css: {
		marginBottom: "3px"
	},
	Header: View.AutoSub.extend({
		addClass: "header",
		content: function(){
			var routeView = this.parent;
			var route = routeView.parent;
			this.item = Item({
				icon: "bullseye",
				label: route.part,
				content: function(){
					this.icon.render();
					this.label.render();
					this.btn = new this.Icon({
						name: "btn",
						type: "bolt"
					}).click(function(){
						if (route.allowDefault)
							window.location = route.path
						else
							route.activate();
					});
				}
			}).css("margin-bottom", "0");
		}
	}),
	Body: View.AutoSub.extend({
		addClass: "body",
		content: function(){
			var routeView = this.parent;
			var route = routeView.parent;

			// this.css("background", "#fefefe")

			// routeView.h3("parts("+ route.parts.length +"): " + route.parts.join("/"))

			// View("# of routes: " + route.routes.length);
			if (route.routes.length){
				// View(function(){
					// routeView.h3("children");
					this.css("padding", "5px 5px 5px 15px");
					for (var i = 0; i < route.routes.length; i++){
						route.routes[i].render();
					}
				// });
			}

		}
	}),
	content: function(){
		this.addClass("route-" + this.parent.id);
		this.header.render();
		if (!this.expand)
			this.body.hide();
		this.body.render();
	},
	behaviors: function(){
		var view = this;
		this.header.item.label.click(function(){
			view.body.toggle();
		});
	}
})