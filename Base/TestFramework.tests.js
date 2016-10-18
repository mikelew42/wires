var TestFramework = require("./TestFramework");
var test = TestFramework.test;

expect = function(a){
	return {
		toBe: function(b){
			console.assert(a === b, a, "===", b);
		}
	}
};

test("Root level describe block", function(){
	var obj = {};

	test("should be an object", function(){
		expect(typeof obj).toBe("object");
	});

	test("should be an instance of an object", function(){
		expect(obj instanceof Object).toBe(true);
	});

	test("First level describe block", function(){
		obj.prop = 5;

		test("should have a prop equal to 5", function(){
			expect(obj.prop).toBe(5);
		});

		test("Second level describe block", function(){
			obj.prop += 5;

			test("should increase by 5", function(){
				expect(obj.prop).toBe(10);
			});

			test("should increase by another 5", function(){
				obj.prop += 5;
				expect(obj.prop).toBe(15);
			});
		});
	});
});
