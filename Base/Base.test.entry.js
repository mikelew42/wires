console.groupCollapsed("Base.test.entry.js");

require("../jasmine");

var Base = require("./Base");
var Evented = require("./Evented");
var Filterable = require("./Filterable");
var Logged = require("./Logged");
var Module = require("./Module");
var is = require("../is");

describe("Base", function describeBase(){
	it("should be a function", function aLottaWork(){
		expect(typeof Base).toBe("function");
	});

	it("should create an instance", function createAnInstance(){
		var base = Base();
		expect(base instanceof Base).toBe(true);
	});

	it("should be extendable", function extendable(){
		var Ext = Base.extend(),
			ext = Ext(),
			Ext2 = Base.extend({
				name: "Ext2",
				prop: 123
			}),
			ext2 = Ext2({
				prop: 456
			}),
			Ext3 = Base.extend({
				only: "props"
			});

		expect(Ext.name).toBe("BaseExt");
		expect()
	});

	it("should extend with no args", function withNoArgs(){
		var Ext = Base.extend();

		expect(Ext.name).toBe("BaseExt");
		expect(Ext.assign).toBe(Base.assign);
		expect(Ext.prototype.assign).toBe(Base.prototype.assign);
		expect(Ext.base).toBe(Base);
		expect(Ext.prototype.type).toBe("BaseExt");
		expect(Ext.prototype.constructor).toBe(Ext);

		var ext = Ext({
			prop: "yo"
		});
		expect(ext.assign).toBe(Base.prototype.assign);
		expect(ext.set).toBe(Base.prototype.set);
		expect(ext.constructor).toBe(Ext);
		expect(ext.type).toBe("BaseExt");
		expect(ext.prop).toBe("yo");
		expect(Ext.prototype.prop).toBeUndefined();
		expect(Base.prototype.prop).toBeUndefined();
	});

	it("should extend with only a name", function withOnlyName(){
		var Ext = Base.extend({
			name: "Ext"
		});

		expect(Ext.name).toBe("Ext");
		expect(Ext.prototype.type).toBe("Ext");

		// copied
		expect(Ext.assign).toBe(Base.assign);
		expect(Ext.set).toBe(Base.set);
		expect(Ext.prototype.assign).toBe(Base.prototype.assign);
		expect(Ext.prototype.set).toBe(Base.prototype.set);
		expect(Ext.base).toBe(Base);
		expect(Ext.prototype.constructor).toBe(Ext);

		var ext = Ext({
			prop: "yo"
		});
		expect(ext.type).toBe("Ext");
		expect(ext.prop).toBe("yo");
		expect(Ext.prototype.prop).toBeUndefined();
		expect(Base.prototype.prop).toBeUndefined();
	});

	it("should extend with only props", function(){
		var Ext = Base.extend({
			// log: true,
			test: 123
		});

		expect(Ext.name).toBe("BaseExt");
		expect(Ext.test).toBeUndefined();
		expect(Ext.prototype.test).toBe(123);

		var ext = Ext();
		expect(ext.test).toBe(123);

		var ext2 = Ext({
			test: 456
		});
		expect(ext2.test).toBe(456);
	});

});

describe("Evented", function(){

	it("should have events", function(){
		var base = Evented(), tests = {};

		base.on("evnt", function(){
			tests.evnt = true;
		});	
		base.on("evnt", function(){
			tests.evnt = true;
		});

		expect(tests.evnt).not.toBe(true);

		base.emit("evnt");
		
		expect(tests.evnt).toBe(true);

		// console.log(base);
	});
});

describe("Filterable", function(){
	it("should allow filters", function(){
		var f = Filterable({
			filterName: function(value){
				return this.applyFilter("filterName", value);
			}
		}), tests = {};

		expect(f.filterName(1)).toBe(1);

		f.filter("filterName", function(value){
			expect(this).toBe(f);
			return value + 3;
		});

		expect(f.filterName(8)).toBe(11);

		f.filter("filterName", function(value){
			return value * 2 - 8;
		});

		// + 3, * 2, -8...
		expect(f.filterName(1)).toBe(0);
	});

	it("should allow additional args", function(){
		var f = Filterable();
		f.filter("my-filter", function(a, b, c){
			expect(a).toBe(1);
			expect(b).toBe(true);
			expect(c).toBe("three");
			return 2;
		});
		expect(f.applyFilter("my-filter", 1, true, "three")).toBe(2);
	});

	it("the events constructor is broken...", function(){
		var f1 = Filterable(), test = { count: 0 };
		f1.filter("my-filter", function(value){
			test.count++;
			return value;
		});

		expect(test.count).toBe(0);
		f1.applyFilter("my-filter");
		expect(test.count).toBe(1);

		var obj = Object.create(f1);
		require("events").call(obj);

		expect(test.count).toBe(1);
		obj.applyFilter("my-filter");
		expect(test.count).toBe(2);

		// as shown here, the prototype _events object is copied over to the new instance
		// this could be a nice feature, but unfortunately there's risk of interference with the base class...

	});
});

describe("Logged", function(){
	it("should be a constructor", function(){
		expect(Logged() instanceof Logged).toBe(true);
	});

	it("should have a .log syncd between prototype and Constructor", function(){
		var Logger = require("../log/Logger"), Method = require("../log/Method");
		expect(Logged.log instanceof Logger).toBe(true);
		expect(Logged.log).toBe(Logged.prototype.log);
		expect(Logged.Logger.Method).toBe(Logged.log.Method);
		expect(new Logged.log.Method() instanceof Method).toBe(true);

		var L2 = Logged.extend();

		expect(L2.log instanceof Logger).toBe(true);
		expect(L2.log).toBe(L2.prototype.log);
		expect(L2.log).not.toBe(Logged.log);
		expect(L2.Logger.Method).toBe(L2.log.Method);
		expect(new L2.log.Method() instanceof Method).toBe(true);
		expect(L2.log.Method).not.toBe(Logged.log.Method);

	});

	it("should wrap methods", function(){
		console.group("should wrap methods");
		// expect(Logged.prototype.create.wrapped).toBeUndefined();
		// expect(Logged.Logger.methods.create).toBe(false);
		
		expect(Logged.Logger.methods.create).toBeDefined();
		// console.dir(Logged.Logger.methods.create.prototype.methodLabel.toString());
		
		// expect(Logged.log.methods).toBe(Logged.Logger.methods);
		expect(Object.keys(Logged.log.methods)).toEqual(Object.keys(Logged.Logger.methods));
		// expect(Logged.Logger.methods.create.base).toBe(Logged.Logger.Method);
		

		// expect(Logged.Logger.prototype.create.wrapped).toBeUndefined();

		var L = Logged.extend({
			name: "L",
			protoMethod: function(){
				console.log("console.log from within protoMethod");
			}
		});

		// console.log(L.log.methods.create.prototype.methodLabel.toString());

		var l = new L({
			name: "l",
			instanceMethod: function(){
				console.log("console.log from within instanceMethod");
				this.protoMethod();
			}
		})

		l.instanceMethod();


		var L2 = Logged.extend({
			name: "L2",
			Logger: {
				methods: {
					create: {
						testInsert: function(){
							return 6;
						}
					}
				}
			}
		});

		var l2 = new L2({
			name: "l2"
		});

		console.groupEnd();
	});

	it("should use custom .methods Method class", function(){
		var L = Logged.extend({
			name: "L",
			Logger: {
				testProp: 123
			},
			wrapMe: function(){
				console.log("so wrapped");
			}
		});

		expect(L.Logger).not.toBe(Logged.Logger);
		expect(L.log instanceof Logged.Logger).toBe(true);
		expect(L.log instanceof L.Logger).toBe(true);
		expect(L.log.testProp).toBe(123);

		var l = new L({
			name: "l"
		});

		expect(l.log).toBe(L.log);

		l.wrapMe();
	});

	it("should immediately instantiate the .log if the Logger property has been assigned, so that it uses this incoming configuration when wrapping the methods", function(){
		var L = Logged.extend({
			preLogger: function(){}, // uses the Logged.prototype.log when accessing "this.log.method"
			Logger: Logged.Logger.extend(),
			postLogger: function(){} // should use this new one
		});

		expect(L.Logger).not.toBe(Logged.Logger);
		expect(L.Logger.Method).not.toBe(Logged.Logger.Method);
		expect(L.log).not.toBe(Logged.log);

		var l = new L();

		expect(l.preLogger.method instanceof Logged.Logger.Method).toBe(true);

		expect(l.postLogger.method instanceof L.Logger.Method);
	});

// requires visual inspection
	xit("should be configurable in different ways", function(){
		var L = Logged.extend();

		console.log(1);
		L.log.log(1);

		console.log(3);
		L.log.test();

		console.log(8);
		L.log.test({
			one: 3,
			two: 5
		});

		L.log.stop();
		L.log.error("you should not see me");

		var L2 = L.extend({
			Logger: L.Logger.extend({
				Test: L.Logger.Test.extend({
					one: 5,
					two: 8
				})
			})
			// this is actually perfectly transparent and efficient..
			// a recursive .extend helper could be really useful, see below
		});

/*
TL;DR:  just skip this for now

L2 = L.extend({
	Logger: {
		Test: {
			one: 5,
			two: 8
		}
	}
});

This would execute the extends in a different order.  Above, the L.Logger.Test.extend would happen first, then L.Logger.extend, and then the L.extend.

The first example, order of execution:
1.  L.Logger.Test.extend
2.  L.Logger.extend
3.  L.extend

The next (directly above) example:
1.  L.extend
2.  L.Logger.extend
3.  L.Logger.Test.extend
(reversed)

Does that matter?  If there are hooks that use a sub class, then it might.  If the L.events.on("extended") hook creates a new Ext.Logger, will that be the new logger?

It depends on when the recursive .extend happens.  You'd need a 

*/



		console.log(2);
		L2.log.log(2);

		console.log(13);
		L2.log.test();

		L.log.error("L2 is on, but L should still be off!!");

		L.log.start();
		
		console.log(3);
		L.log.log(3);

		var L3 = Logged.extend();
		
		console.log(123);
		L3.log.log(123);
		L3.Logger.prototype.stop();

		L3.log.error("You should not see me!!");

		var L4 = L3.extend();
		L4.log.error("this should be off");
		L3.log.error("this should be off");

		L3.log.start();
		console.log(11);
		L3.log.log(11);
		L4.log.error("this should be off");

		console.log(12);
		L3.log.log(12);
		/*
		Can I attempt a styled log Sub class?

Logger.Message
Logger.msg()
this.log.msg(o)
	new this.Message(o, {log: this});

// at the very least, this helps vet the whole sub classing, config, and instantiation...


		Order of configuration:
		When we .extend a Logged class, we're extending the sub classes as well.  AT THE TIME OF .EXTENSION, THE CONFIGURATION OF THE LOGGER, AND ITS SUB CLASSES, IS COPIED..

		If you want future classes to inherit config of sub classes, you have to configure them BEFORE extending.  This shouldn't be hard to do.  You can configure the sub classes during the creation of the base class.

		Then, when we modify a 
		*/
	});

	it("should have an assign filter", function(){
		var l = Logged(), test = {};
		l.filter("assign", function(value, name){
			test.value = value;
			test.name = name;
			return value;
		});

		l.assign({ yo: "diggity" });

		expect(test.value).toBe("diggity");
		expect(test.name).toBe("yo");
	});

	it("should wrap prototype properties assigned with assign", function(){
		var test = {};
		var L2 = Logged.extend({
			name: "L2",
			Logger: Logged.Logger.extend({
				// skip: true,
				Method: Logged.Logger.Method.extend({
					contain: true
				})
			}),
			wrappedTwice: function(one, two){
				test.one = true;
				this.log.info("inside wrappedTwice");
				one = this.anotherMethod(one);
				return one + " asdf " + two;
			},
			anotherMethod: function(arg){
				this.log.log("inside anotherMethod");
				return arg + 1;
			}
		});

		var l1 = L2({ name: "l1" });
		l1.wrappedTwice(123, "asdf");
		expect(test.one).toBe(true);

		var l = L2({
				name: "l",
				wrappedTwice: function(a, b){
					test.two = true;
					return a + b;
				}
			});
		
		l.wrappedTwice(1, "two");
		expect(test.two).toBe(true);
	});

	it("should copy itself when extended", function(){
		var test = {},
			L2 = Logged.extend({
				name: "L2",
				prototypeMethod: function(){
					console.log("inside L2.prototypeMethod");
					this.log.log("eww, this.log.log(???)")
				}
			});

		expect(Logged.log).toBe(Logged.prototype.log);
		expect(L2.log).toBe(L2.prototype.log);
		expect(L2.log).not.toBe(Logged.log);

		var l2 = L2({
			name: "l2",
			instanceMethod: function(firstArg, secondArg){
				console.log("inside l2.instanceMethod()");
				this.log.info("here's some info");
				this.prototypeMethod();
				return firstArg + secondArg;
			}
		});

		l2.instanceMethod("one", true, 3, {four: 4});

		// realtime cases vs pre-extend cases
		// if you turn Logged.log.stop() inside the Logged file, all loggers will be off, unless you turn them .start()

		// however, for a specific .log instance, you can turn it on/off in realtime.  It all depends if there's a log per Class or per instance


	});

	xit("should recursively extend", function(){
		var L2 = Logged.extend();

		expect(Logged.Logger).toBeDefined();

		// expect(L2.Logger).toBeDefined();
	});

	// has to be verified visually...
	it("should automatically wrap assigned functions", function(){
		var L2 = Logged.extend({
				amIWrapped: function(){
					console.log("amIWrapped?");
				}
			}),
			l = L2({
				yep: function(){

				}
			}), 
			test = {};
		
		l.assign({
			name: "l",
			myMethod: function(a, b, c){
				return a + 2 * b - c;
			}
		});

		l.myMethod(1, 8, 123);
		l.yep();
		l.amIWrapped();
	});

});


describe("Module", function(){
	xit("constructors, prototypes, and instances, should all have IDs", function(){
		var test = {},
			Mod = Module.extend(),
			mod = Mod();

		// console.log(Module.id, Module.prototype.id, Mod.id, Mod.prototype.id, mod.id);
	});

	it("should have extend events", function(){
		var test = {},
			Mod = Module.extend({
				name: "Mod",
				config: function(){
					this.events.on("setupPrototype", function(){
						test.one = true;
					});
				},
				Sub: Module.extend({
					name: "Sub",
					subProp: 1,
					SubSub: Module.extend({
						name: "SubSub",
						subSubProp: 2
					}).assign({
						prop: "SubSub.prop"
					})
				}).assign({
					prop: "Sub.prop"
				})
			});

		expect(test.one).toBe(true);

		expect(Mod.Sub).toBeDefined();
		expect(Mod.Sub.prop).toBe("Sub.prop");
		expect(Mod.Sub.extend).toBeDefined();
		expect(Mod.Sub).toBe(Mod.prototype.Sub);

		expect(Mod.Sub.SubSub.extend).toBeDefined();
		expect(Mod.Sub.SubSub.prop).toBe("SubSub.prop");
		expect(Mod.Sub.SubSub).toBe(Mod.Sub.prototype.SubSub);

		expect(new Mod.Sub().SubSub).toBe(Mod.Sub.SubSub);


		var Mod2 = Mod.extend({
			name: "Mod2"
		});

		expect(Mod2.base).toBe(Mod);
		expect(Mod2.Sub.prop).toBe("Sub.prop");
		// console.dir(Mod)
		// console.dir(Mod2);

		expect(Mod2.Sub).not.toBe(Mod.Sub);
		expect(new Mod2.Sub() instanceof Mod.Sub).toBe(true);
		expect(Mod2.Sub.base).toBe(Mod.Sub);
		expect(Mod2.Sub).toBe(Mod2.prototype.Sub);

		expect(Mod2.Sub.SubSub).not.toBe(Mod.Sub.SubSub);
		expect(Mod2.Sub.SubSub.prop).toBe("SubSub.prop");
		expect(Mod2.Sub.SubSub).toBe(Mod2.Sub.prototype.SubSub);
		expect(new Mod2.Sub.SubSub() instanceof Mod.Sub.SubSub).toBe(true);

		var Mod3 = Mod.extend({ name: "Mod3" });
		expect(Mod3.Sub).not.toBe(Mod2.Sub);
		expect(Mod3.Sub.SubSub).not.toBe(Mod2.Sub.SubSub);

		var Mod4 = Mod2.extend({ name: "Mod4" });
		expect(Mod4.Sub).not.toBe(Mod2.Sub);
		expect(Mod4.Sub.SubSub).not.toBe(Mod2.Sub.SubSub);

		var Mod5 = Mod.extend({
			name: "Mod5",
			Sub: Mod.Sub.extend({
				name: "Mod5Sub",
				SubSub: Mod.Sub.SubSub.extend({
					name: "Mod5SubSub"
				}).assign({
					prop: "Mod5SubSub.prop"
				})
			}).assign({
				prop: "Mod5Sub.prop"
			})
		});

		expect(Mod5.Sub.prop).toBe("Mod5Sub.prop");
		expect(Mod5.Sub.SubSub.prop).toBe("Mod5SubSub.prop");
	});
});

console.groupEnd();