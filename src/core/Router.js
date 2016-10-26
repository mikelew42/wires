var Base = require("../Base");
var Route = require("./Route");
var History = require("history").createBrowserHistory;

var Router = module.exports = Base.extend({
	name: "Router",
	init: function(){
		this.routes = this.routes || [];
		this.history = History();
		var router = this;
		this.history.listen(function(location, action){
			// console.group("history.listen");
			// console.log("location", location);
			// console.log("action", action);
			router.matchCurrentRoute();
			// console.groupEnd();
		});
	},
	each: function(fn){
		for (var i = 0; i < this.routes.length; i++){
			fn.call(this, this.routes[i], i);
		}
		return this;
	},
	matchCurrentRoute: function(){
		// this.log && console.group("matching route ...");
		var matches = [], match;
		if (!this.matched){
			this.each(function(route){
				if (route.matchBeginning){
					if (window.location.pathname.indexOf(route.pathname) === 0){
						matches.push(route);
					}
				} else if (route.pathname === window.location.pathname){
					// this.log && console.group('matched', route.pathname);
					route.runCBs();
					this.matched = true;
					// this.log && console.groupEnd();
				}
			});

			if (this.matched)
				return false; // keep an exact match if found

			// otherwise, use the longest path match
			else if (matches.length){
				match = matches[0];
				for (var i = 1; i < matches.length; i++){
					if (matches[i].length > match.length)
						match = matches[i];
				}
				match.runCBs();
				this.matched = true;
			}

			
		}
		// this.log && console.groupEnd();
	},
	addRoutes: function(){
		for (var i = 0; i < arguments.length; i++){
			this.addRoute(arguments[i]);
		}
		this.matchCurrentRoute();
		return this;
	},
	addRoute: function(route){
		route.router = this;
		this.routes.push(route);
		return this;
	},
	deactivateAll: function(){
		for (var i = 0; i < this.routes.length; i++){
			this.routes[i].deactivate();
		}
	},
	pushRoute: function(route){
		this.history.push(route.pathname);
		return this;
	}
});


/*
Maybe:

router.addRoutes({
	routeName: {
		pathname,
		label,
		then: fn(){}
	},
	anotherRouteName: {
	
	}
});

then

router.routeName.then(cb)
router.routeName.activate(), etc...?

The Router could also accept a page property.  The page would be transitioned in.  You'd need the router to specify a root container...
*/