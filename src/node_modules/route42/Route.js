var Mod1 = require("mod42/Mod1");
var Mod2 = require("mod42/Mod2");
var Mod3 = require("mod42/Mod3");
var Mod4 = require("mod42/Mod4");
var is = require("is");

var shared = require("./shared");

var RouteView = require("./RouteView");

var logger = require("log42");
var log = logger();

var Route = module.exports = Mod2.Sub.extend({
	name: "Route42",
	View: RouteView,
	// log: true,
	set: {
		other: function(route, value){
			route.path = value;
		}
	},
	init: function(){
		this.log.groupc("new route", this.path);
		this.log(this);
		this.cbs = [];
		this.dcbs = [];
		this.routes = [];

		this.parsePath();

		this.name = this.part;
		this.log.end();
	},
	render: function(){
		this.view = new this.View({
			parent: this
		});
	},
	// name might/be/a/path
	parsePath: function(){
		var bridgeParts;
		this.log("path:", this.path);
		if (this.path.indexOf("/") > -1){
			bridgeParts = shared.parts(this.path);
			this.part = bridgeParts[bridgeParts.length - 1];
			this.bridge(bridgeParts);
			this.log("this.part:", this.part);
		} else {
			this.part = this.path;
			this.log("this.part:", this.part);
			this.setParent(this.parent)
		}

	},
	// now, we're passing all the path parts, including this one, into bridgeParts
	bridge: function(bridgeParts){
		var parent = this.parent;
		// first, match as far as possible
		var match = parent.match(bridgeParts);

		var remaining;

		this.log("match:", match);
		if (match){
			if (match.remaining.length){
				parent = match.route;
				bridgeParts = match.remaining;
			} else {
				// exact match... override?
				// match.route.parent.addRoute(this);
				// we need to remove the previous from the .routes array...
				console.error("re-adding route");
			}
		}

		this.log("bridging gap between parent and this, using bridgeParts");
		this.log("parent:", parent);
		this.log("bridgeParts:", bridgeParts);


		// bridge between the closest ancestor, and all but the last bridgePart
		for (var i = 0; i < bridgeParts.length - 1; i++){
			parent = parent.add(bridgeParts[i]);
		}

		this.setParent(parent);
	},
	makeFullPath: function(){
		if (this.parent){
			this.parts = this.parent.parts.slice(0)
		} else {
			this.parts = [];
		}

		this.parts.push(this.part);

		this.path = "/" + this.parts.join("/") + "/";
		return this.path;
	},
	// remaining parts
	match: function(parts){
		if (parts[0] === this.part){
			return this.matched(parts.slice(1));
		} else {
			return false;
		}
	},
	matched: function(remaining){
		var match;
		if (remaining.length){
			for (var i = 0; i < this.routes.length; i++){
				match = this.routes[i].match(remaining);
				if (match)
					return match;
			}	
		}
		return {
			route: this,
			remaining: remaining
		};
	},
	activate: function(){
		if (!this.active){
			this.log("not currently active");
			// deactivate current
			if (this.router.active){
				this.log("deactivate the active route");
				this.router.active.deactivate();
			}

			this.active = true;
			this.router.active = this;

			if (window.location.pathname !== this.path){
				this.log("path mismatch");
				if (this.matchBeginning){
					if (window.location.pathname.indexOf(this.path) === 0){
						this.log("partial match, don't change URL");
					}
				} else {
					this.log("path mismatch, history.push(", this.path, ")");
					this.router.history.push(this.path);
				}
			}

			this.exec();
			
		} else {
			this.log("already active");
		}
	},
	exec: function(){
		for (var i = 0; i < this.cbs.length; i++){
			this.cbs[i].call(this);
		}
	},
	deactivate: function(){
		if (this.active){
			this.active = false;
			this.dexec();
		} else {
			console.warn("oops");
		}
	},
	dexec: function(){
		for (var i = 0; i < this.dcbs.length; i++){
			this.dcbs[i].call(this);
		}
	},
	setParent: function(parent){
		this.parent = parent;
		this.router = parent.router;
		this.makeFullPath();
		parent.addRoute(this);
	},
	add: function(route){
		return new this.Route({
			log: this.log.value
		}, {
			parent: this
		}, route);
	},
	addRoute: function(route){
		this.routes.push(route);

		if (!this[route.part]){
			this[route.part] = route;
		}
	},
	then: function(cb, dcb){
		this.cbs.push(cb);
		if (dcb)
			this.andThen(dcb);
		return this;
	},
	andThen: function(dcb){
		this.dcbs.push(dcb);
		return this;
	},

	logAll: function(){
		this.log.group("routes:", this.routes.length);
		for (var i = 0; i < this.routes.length; i++){
			this.log.group(this.routes[i].name);
			this.routes[i].logAll();
			this.log.end();
		}
		this.log.end();
	}
});

Route.prototype.Route = Route;