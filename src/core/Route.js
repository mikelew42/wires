var Base = require("../Base");
var Link = require("./Link");
var history = require("history").createBrowserHistory();

var Route = module.exports = Base.extend({
	name: "Route",
	label: "Default Route Label",
	init: function(){
		this.cbs = [];
		if (this.pathname[0] !== "/" && !this.relative)
			this.pathname = "/" + this.pathname;
		if (this.pathname[this.pathname.length - 1] !== "/")
			this.pathname = this.pathname + "/";
	},
	link: function(){
		return new Link({
			route: this
		});
	},
	deactivate: function(){
		this.active = false;
	},
	activate: function(){
		// this.log && console.group("Route.activate");
		if (window.location.pathname !== this.pathname){
			this.changeURL();
			this.runCBs();
		} else {
			// this.log && console.log("pathname unchanged");
		}
		// this.log && console.groupEnd();
	},
	changeURL: function(){
		// this.log && console.log('Route.changeURL');
		this.router.pushRoute(this);
	},
	runCBs: function(){
		this.router.deactivateAll();
		this.router.activeRoute = this;
		this.active = true;
		// this.log && console.log("Route.runCBs");
		for (var i = 0; i < this.cbs.length; i++){
			this.cbs[i].call(this);
		}
	},
	then: function(cb){
		this.cbs.push(cb);
		return this;
	}
});