var Base3 = require("../Base3/Base3");
var is = require("../is");
var Page = require("../Page/Page2");
var global_app_module = require("app");
var registered_global_module = false;

// var Test = require("../Test/Test");

var pageTree = function(req_ctx){
	console.dir(req_ctx);
	var tree = {}, t;
	var keys = req_ctx.keys(), key, paths, page;

	for (var i = 0; i < keys.length; i++){
		key = keys[i].replace("./", "").replace(".page.js", "");

		if (key.indexOf("/")){
			paths = key.split("/");
			page = paths.pop();
			t = {};
			// start with root path
			for (var j = 0; j < paths.length; j++){
				if (!tree[paths[j]]){

				}
			}
		} else {

		}
		tree[key] = 
	}
};

var App = Base3.extend({
	// Test: Test,
	init: function(){
		this.init_app();
	},
	init_app: function(){
		this.register_global_module();
		this.load_pages();
	},
	register_global_module: function(){
		if (!registered_global_module){
			global_app_module.exports = this;
			registered_global_module = true;
		}
	},
	load_pages: function(){
		var pages = require.context("../", true, /\.page\.js$/);

		this.require_all(pages);
	},
	require_all: function(req_ctx){
		req_ctx.keys().forEach(req_ctx);
	}
});

module.exports = App;