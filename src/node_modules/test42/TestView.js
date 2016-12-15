var View = require("View");
var Item = require("Item");

require("./Test.less");

var Test;

var TestView = module.exports = View.extend({
	log: false,
	name: "TestView",
	addClass: "test light",
	expand: true,
	init: function(){
		this.parent.view = this;
	},
	Header: View.AutoSub.extend({
		addClass: "header",
		content: function(){
			var testView = this.parent;
			var test = testView.parent;

			this.item = Item({
				icon: "beer",
				label: test.name,
				content: function(){
					this.icon.render();
					this.label.render();
					this.btn = new this.Icon({
						name: "btn",
						addClass: "btn",
						type: "bolt"
					}).click(function(){
						console.log(test.route)
						if (test.route){
							// test.root.route.deactivate();
							// console.clear();
							// test.route.activate()
							window.location = test.route.path;
						}
					});
				}
			});
		}
	}),
	Body: View.AutoSub.extend({
		addClass: "body",
		content: function(){
			var testView = this.parent;
			var test = testView.parent;

			this.hide();

			// console.log(View.captor === this);

			if (test.enabled){

				this.nested = View(function(){
					test.fn();
				}).addClass("nested");
				// run the tests

				if (test.tests.length){
					this.show();
				} else {
					this.nested.hide();
				}

				if (this.nested.html().length){
					this.show();
					this.nested.show();
				}

				if (test.pass){
					View.p(test.pass + " passed").css("color", "green");
					this.show();
				}
				if (test.fail){
					testView.addClass("failed");
					View.p(test.fail + " failed").css("color", "red");
					this.show();
				} else {
					testView.addClass("passed");
				}
			} else {
				testView.addClass("disabled")
			}
		}
	}),
	content: function(){
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
});