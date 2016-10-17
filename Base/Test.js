var is = require("../is");
var Base = require("./Base");

var Expectation = Base.extend({
	init: function(){
		this.test.addExpectation(this);
		this.init_not();
	},
	init_not: function(){
		var self = this;
		this.not = {
			toBe: function(b){
				if (self.a !== b){
					self.pass = true;
				} else {
					console.assert(self.a !== b, self.a, "!==", b);
				}
			},
			toBeDefined: function(){
				if (self.a === undefined){
					self.pass = true;
				} else {
					console.assert(self.a === undefined, self.a, "===", undefined);
				}
			},
			toBeUndefined: function(){
				if (self.a !== undefined){
					self.pass = true;
				} else {
					console.assert()
				}
			}
		};
	},
	toBe: function(b){
		if (this.a === b){
			this.pass = true;
		} else {
			console.assert(this.a === b, "Expectation: (", this.a, "===", b, ")");
		}
	},
	toBeDefined: function(){
		if (this.a !== undefined){
			this.pass = true;
		} else {
			console.assert(this.a !== undefined, this.a, "!==", undefined);
		}
	},
	toBeUndefined: function(){
		if (this.a === undefined){
			this.pass = true;
		} else {
			console.assert(this.a === undefined, this.a, "===", undefined);
		}
	}
});

var Test = Base.extend({
	init: function(){
		this.expectations = [];
		this.exec();
	},
	exec: function(){
		console.group("Test " + this.name);
		this.setup();
		this.test();
		this.report();
		console.groupEnd();
	},
	setup: function(){},
	test: function(){},
	report: function(){
		var pass = 0, fail = 0;
		for (var i = 0; i < this.expectations.length; i++){
			if(this.expectations[i].pass){
				pass++;
			} else {
				fail++;
			}
		}
		if (fail > 0){
			console.error("%cTest " + this.name + " finished. " + fail + " expectations failed. %c" + pass + " passed.", "color: red", "color: green");
		} else if (pass > 0) {
			console.log("%cTest " + this.name + " finished. All " + pass + " expectation(s) passed.", "color: green");
		} else {
			console.warn("Test " + this.name + " finished with 0 expectations.");
		}
	},
	addExpectation: function(expectation){
		this.expectations.push(expectation);
	},
	expect: function(a){
		return new this.Expectation({
			a: a,
			test: this
		});
	},
	Expectation: Expectation.extend()
});

module.exports = Test;