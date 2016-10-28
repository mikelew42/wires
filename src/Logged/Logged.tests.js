var TestFramework = require("../test/framework");
var test = TestFramework.test;
var is = require("../is");
var $ = require("jquery");
var assert = console.assert.bind(console);

var Logged = require("./Logged");

$(function(){

test("Logged", function(){

	test("simple instance wrapping", function(){
		var l = new Logged({
			name: "l",
			wrapMe: function(){
				this.log.log("inside wrapMe");
				this.log.debug("inside wrapMe");
				this.log.info("inside wrapMe");
				this.log.warn("inside wrapMe");
				this.log.error("inside wrapMe");
			}
		});

		assert(l.log === Logged.prototype.log);

		l.wrapMe();
	});

	test("extending", function(){

		test("simple extend", function(){
			var L = Logged.extend({
				name: "L",
				expandedMethod: function(){
					this.log.log("wee, i'm expanded");
				},
				Logger: {
					disable: true,
					methods: {
						expandedMethod: {
							expand: true
						}
					}
				}
			});

			assert(L.prototype.log.disable);

			assert(L.prototype.Logger !== Logged.prototype.Logger);
			assert(L.prototype.Logger.isExtensionOf(Logged.prototype.Logger));

			assert(L.prototype.log !== Logged.prototype.log);
			assert(L.prototype.log instanceof L.prototype.Logger);
			assert(L.prototype.log instanceof Logged.prototype.Logger);

			// L.prototype.log.stop();

			test("turned off, all instances should not log", function(){
				var l = new L({
					name: "l",
					newMethod: function(){
						console.log("am I wrapped?");
						this.log.log("am I turned off?");
						this.log.error("this should not happen");
					}
				});

				l.expandedMethod();
				l.newMethod();

				l.log.start();
				l.expandedMethod();
				l.newMethod();
				l.log.stop();

			});
		});

		test("turn off per instance", function(){



		});

	});
});

});