var app = require("app");
var Page = require("./Page/Page2");
var View = require("./View/View");
var Div = require("./View/Div");

app.home = Page({
	app: app,
	title: "lew42.com",
	pathname: "/",
	content: function(){
		Div("This is the homepage.");
		this.link();
	}
});