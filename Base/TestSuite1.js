var Test = require("./Test");

var test = new Test({
	name: "test",
	setup: function(){
		this.a = 1;
		this.b = 2;
	},
	test: function(){
		this.expect(this.a).toBe(2);
		this.expect(this.b).toBe(2);
		this.expect(true).toBe(false);
	}
});

var TestClass = Test.extend({
	name: "TestClass",
	setup: function(){
		this.a = 123;
		this.b = "four";
	}
});

var test1 = TestClass({
	name: "test1",
	test: function(){
		this.expect(this.a).toBe(123);
	}
});

var test2 = TestClass({
	name: "test2",
	test: function(){
		this.expect(this.b).toBe("four");
	}
});