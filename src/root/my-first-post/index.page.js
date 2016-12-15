var app = require("app");
// console.log("app", app);

var Div = app.Page.Div;
var View = app.View;
var P = View.extend({
	tag: "p"
});

app.Page({
	name: "my_first_post",
	pathname: "my-first-post",
	title: "My First Post",
	content: function(){
		this.header();
		this.body();
		this.footer();
	},
	header: function(){
		var page = this;
		Div("header", function(){
			View({
				tag: "h1",
				content: page.title
			});

			page.nav();
		});
	},
	body: function(){
		Div("body", function(){
			P("Hello world, this is my first paragraph.")
		});
	},
	footer: function(){
		Div("footer", function(){

		})
	},
	nav: function(){
		if (this.pages){
			// display sub nav
		}
	}
});