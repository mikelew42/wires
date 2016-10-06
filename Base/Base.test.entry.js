require("../jasmine");

var Base = require("./Base");
var Evented = require("./Evented");

// Base.log = true;

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
