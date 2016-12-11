var is = require("is");
var Mod3 = require("mod42/Mod3");
var utils = require("utils");
var sanitize = utils.sanitizeString;

var TestView = require("./TestView.js");

var Test = module.exports = Mod3.extend({
	name: "Test",
	pass: 0,
	fail: 0,
	// log: true,
	methods: {
		instantiate: {
			expand: true
		}
	},
	set: {
		other: function(test, arg){
			if (is.fn(arg))
				test.fn = arg;
			else if (is.str(arg))
				test.name = arg;
			else
				console.warn("not sure how to set: ", arg);
			return test;
		}
	},
	enable: function(value){
		if (value === false){
			this.enabled = false;
			this.disabled = true;
		} else {
			this.enabled = true;
			this.disabled = false;
		}
	},
	disable: function(value){
		if (value === false){
			this.disabled = false;
			this.enabled = true;
		} else {
			this.disabled = true;
			this.enabled = false;
		}
	},
	init: function(){
		this.tests = [];
		this.enable();

		this.url = sanitize(this.name);

		// sets parent
		this.getCaptured();

		// grabs .route from Test.route, only for a root test
		this.getRootRoute();

		this.initRoute();

		if (this.autoExec !== false)
			this.exec();
	},
	render: function(){
		this.view = new TestView({
			parent: this
		})
	},
	// should only run for root test groups
	getRootRoute: function(){
		if (!this.parent && Test.route){
			this.log.info("adopting Test.route");
			// mock it
			this.parent = {
				route: Test.route
			};

			this.root = this;

			this.remaining = Test.route.remaining.slice(1);
			if (Test.route.remaining.length){
				this.next = Test.route.remaining[0];
			}
		} else {
			this.root = this.parent.root;
		}
	},
	initRoute: function(){
		this.route = this.parent.route.add(this.url);
		if (this.next){
			this.log("next up:", this.next);
			if (this.url === this.next){
				this.log("batter up");
			} else {
				this.disable();
				this.skip = true;
			}
			this.next = this.remaining.shift();
			this.log("and next:", this.next);
		}
	},
	getCaptured: function(){
		if (Test.captor)
			Test.captor.add(this);
	},
	add: function(child){
		child.parent = this;
		child.next = this.next;
		child.remaining = this.remaining.slice(0);
		this.tests.push(child);
	},
	// if the route doesn't match, skip it
	prevent: function(child){
		if (this.remaining.length && child.name !== this.remaining[0]){
			child.autoExec = false;
		}
	},
	exec: function(){
		this.becomeCaptor();
		
		if (this.enabled)
			console.group(this.name);

		this.render();
		
		if (this.enabled)
			console.groupEnd();
		
		this.restoreCaptor();
	},
	becomeCaptor: function(){
		this.previousCaptor = Test.captor;
		Test.captor = this;
	},
	restoreCaptor: function(){
		Test.captor = this.previousCaptor;
	},
	error: function(a){
		console.error(a);
	},
	assert: function(value){
		if (value){
			this.pass++;
		} else {
			console.error("Assertion failed");
			this.fail++;
		}
	}
}).assign({
	assert: function(value){
		if (!is.bool(value))
			console.warn("you shouldn't assert values... use 'is' to check it out");

		Test.captor.assert(value);
	}
});
// console.log(Test.prototype.set.mfn.wrapMethod);
// console.log(Test.prototype.log)
// console.log(Test.prototype.log.value);