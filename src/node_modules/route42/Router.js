var Mod1 = require("mod42/Mod1");
var Mod2 = require("mod42/Mod2");
var Mod3 = require("mod42/Mod3");
var is = require("is");
var Route = require("./Route");
var History = require("history").createBrowserHistory;

var logger = require("log42");
var log = logger();

var RouterView = require("./RouterView");

var shared = require("./shared");

// TODO Router should extend Route...
var Router = module.exports = Route.extend({
	// log: true,
	name: "Router42",
	Route: Route,
	View: RouterView,
	isRouter: true,
	path: "/",
	part: "",
	parts: [],
	init: function(){
		this.cbs = [];
		this.dcbs = [];
		this.routes = [];
		this.history = History();
		this.history.listen(this.historyListener.bind(this));
		this.router = this;
	},
	render: function(){
		this.view = new this.View({
			parent: this
		});
	},
	historyListener: function(location, action){
		var match;
		this.log.group("historyListener", location, action);
		if (action === "POP"){
			this.matchAndActivate();
		} else {
			this.log("action:", action, "(do nothing)");
		}
		this.log.end();
	},
	matchAndActivate: function(){
		this.log.group("matchAndActivate");
		var match = this.match(this.getCurrentURLPathParts());
		if (match){
			match.route.remaining = match.remaining;
			match.route.activate();
		}
		this.log.end();
		return this;
	},
	match: function(pathParts){
		var match;
		for (var i = 0; i < this.routes.length; i++){
			match = this.routes[i].match(pathParts)
			if (match)
				return match;
		}
		return false;
	},
	getCurrentURLPathParts: function(){
		return shared.cleanPathParts(window.location.pathname.split("/"));
	}
});