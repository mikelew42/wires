require("../jasmine");
var is = require("./is");

describe("is.arr", function(){
	it("should identify an array", function(){
		expect(is.arr([])).toBe(true);
	});

	it("should not identify an object", function(){
		expect(is.arr({})).toBe(false);
	});
});

describe("the rest, until I have time to write these", function(){
	it("should identify the rest", function(){
		var und;

		expect(is.obj({})).toBe(true);
		expect(is.obj([])).toBe(false);

		expect(is.str("")).toBe(true);
		expect(is.num(123)).toBe(true);
		expect(is.bool(false)).toBe(true);
		expect(is.fn(function(){})).toBe(true);
		expect(is.def(is)).toBe(true);
		expect(is.undef(und)).toBe(true);
		
	});
});