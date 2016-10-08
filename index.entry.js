var Router = require("./core/Router");
var Route = require("./core/Route");
var $ = require("jquery");
var $body = $("body");
var $root = $(".root").addClass("outlines");
require("./styles.less");

// require("logger");

// var IPBCLE = require("./core/IPBCLE");
// var log = IPBCLE();
// log.group("test");

var Logger = require("./log/Logger");
var log = new Logger();

log.log("yo");
log.group("group");
log.end(function(){
	log.info("info");
	log.warn("warn");
	log.group("sub group");
	log.end(function(){
		log.error("error");
		log.debug("debug");
	});
	log.trace("trace");
	log.groupc("collapsed");
	log.end(function(){
		log.log('yerp');
	});
	log.info("end of first group");
});



var Tabs = require("./components/Tabs");

var tabs = new Tabs().addTabs({
	test1: {
		label: "Test 1"
		// route??
	},
	test2: {
		label: "Test 2"
	},
	test3: {
		label: "Test 3"
	}
});
console.log(tabs);
tabs.test1.$el.html("<h1>Test 1</h1>");
tabs.test2.$el.html("<h1>Test 2</h1>");
tabs.test3.$el.html("<h1>Test 3</h1>");

tabs.$el.appendTo($root);

// $(document).ready(function(){
// 	console.log('document.ready');
// });

// $(window).on('load', function(){
// 	console.log('window.load');
// });

/* Routes should use two slashes (trialing and leading) to avoid strange behavior */
var router = new Router().addRoutes(
	new Route({
		pathname: "/leading-slash",
		label: "Leading Slash"
	}).then(function(){
		console.log("route.then", this);
	}), 
	
	new Route({
		pathname: "trailing-slash/",
		label: "Trailing Slash"
	}).then(function(){
		console.log("route.then", this);
	}), 

	new Route({
		pathname: "/two-slashes/",
		label: "Two Slashes"
	}).then(function(){
		console.log("route.then", this);
	}), 

	new Route({
		pathname: "no-slashes",
		label: "No Slashes"
	}).then(function(){
		console.log("route.then", this);
	})
);

$(function(){
	var link;

	for (var i = 0; i < router.routes.length; i++){
		link = router.routes[i].link();
		$("<div>").append(link.$el).appendTo($root);
	}
});