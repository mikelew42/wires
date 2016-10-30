// var app = require("./app");
require("./test");

var Page = require("./Page/Page");
// var Item = require("./Item/Item");

new Page({
	name: "Test1",
	content: function(){
		this.h1("Yeee hewa");
	}
}).route.then(function(){
	console.log("yo");
});

new Page({
	name: "Test2",
	content: function(){
		// Item()
	}
});


new Page({
	name: "Test3"
});

new Page({
	name: "Test4"
});