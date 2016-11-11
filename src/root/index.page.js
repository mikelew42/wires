var app = require("app");
var Page = require("Page/Page2");
var View = require("View");
var Div = require("View/Div");

app.home = Page({
	app: app,
	title: "lew42.com",
	pathname: "/",
	content: function(){
		Div("This is the homepage.");
		this.link();

		// Div("This is a ", this.link(), " to another page.");
		//  --> if you allow inline content to be strung together like this, then it conflicts with the Div("class", function(){}) pattern, in case you wanted to be able to do Div("Some text ", function content(){})
		// You could create a Block("nameClass es", function content(){}) to handle that use case, and then use Div if you need more literal usage.
	}
});