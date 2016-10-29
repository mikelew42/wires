// var app = require("./app");
require("./test");

var Page = require("./Page/Page");

new Page({
	name: "Test1",
	content: function(){
		this.h1("Yeee hewa");
	}
}).route.then(function(){
	console.log("yo");
});

new Page({
	name: "Test2"
});


new Page({
	name: "Test3"
});

new Page({
	name: "Test4"
});