var Router = require("./core/Router");
var Route = require("./core/Route");
var $ = require("jquery");

var router = new Router().addRoutes(
	// new Route({
	// 	pathname: "/",
	// 	label: "Home"
	// }).then(function(){
	// 	console.log("welcome home")
	// })
	// new Route({
	// 	pathname: "/leading-slash",
	// 	label: "Leading Slash"
	// }).then(function(){
	// 	console.log("route.then", this);
	// }), 
	
	// new Route({
	// 	pathname: "trailing-slash/",
	// 	label: "Trailing Slash"
	// }).then(function(){
	// 	console.log("route.then", this);
	// }), 

	// new Route({
	// 	pathname: "/two-slashes/",
	// 	label: "Two Slashes"
	// }).then(function(){
	// 	console.log("route.then", this);
	// }), 

	// new Route({
	// 	pathname: "no-slashes",
	// 	label: "No Slashes"
	// }).then(function(){
	// 	console.log("route.then", this);
	// }),

	// new Route({
	// 	pathname: "double/slash",
	// 	label: "Double Slash"
	// }).then(function(){
	// 	console.log("route.then", this);
	// }),

	// new Route({
	// 	pathname: "relative",
	// 	label: "Relative",
	// 	relative: true
	// })
);

module.exports = router;

$(function(){
	var link;

	for (var i = 0; i < router.routes.length; i++){
		link = router.routes[i].link();
		$("<div>").css({ background: "white" }).append(link.$el).appendTo("#docroot");
	}
});