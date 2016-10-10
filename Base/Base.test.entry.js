require("../jasmine");

var Base = require("./Base");
var Evented = require("./Evented");
var Filterable = require("./Filterable");
var Logged = require("./Logged");

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
			wrappedTwice: function(one, two){
				test.one = true;
				return one + " asdf " + two;
			}
		});

		var l1 = L2();
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
		// if you turn Logged.log.off() inside the Logged file, all loggers will be off, unless you turn them .on()

		// however, for a specific .log instance, you can turn it on/off in realtime.  It all depends if there's a log per Class or per instance


	});

	// has to be verified visually...
	xit("should automatically wrap assigned functions", function(){
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