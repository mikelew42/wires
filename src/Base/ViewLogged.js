var Test = require("./Test");
var Logged = require("./Logged");
var $ = require("jquery");

$(function(){
	var Test1 = Test.extend({
		setup: function(){
			this.setup_L();
			this.setup_l();
		},
		setup_L: function(){
			this.L = Logged.extend({
				Logger: {
					Method: {
						logAndExecMethod: function(ctx, args){
							var $el = $("<div>SUCCESS!!@#!@#</div>").appendTo("body");
						}
					}
				}
			});
		},
		setup_l: function(){
			this.l = new this.L({
				wrapMe: function(){
					console.log("inside wrapMe");
				}
			});
		},
		test: function(){
			this.l.wrapMe();
		}
	});

	var test1_1 = new Test1({
		name: "test1_1"
	});
	var test1_2 = new Test1({
		name: "test1_2",
		setup: function(){
			this.setup_L();
			this.setup_L2();
			this.setup_l();
		},
		setup_L2: function(){
			this.L = this.L.extend({

			});
		}
	});

	var Test2 = Test1.extend({

	});
	

});