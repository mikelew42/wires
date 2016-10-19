var TestFramework = require("./TestFramework");
var test = TestFramework.test;
var $ = require("jquery");

expect = function(a){
	return {
		toBe: function(b){
			console.assert(a === b, a, "===", b);
		}
	}
};

$(function(){
	debugger;
	test("root", function(){
		console.log("root starter");
		// console.log("inside Root level describe block");
		var obj = {};

		test("A", function(){
			console.log("inside A");
		});

		console.log("A B tweener");

		test("B", function(){
			console.log("inside B");
		});
	 
	 // 	test("Z", function(){

	 // 		test("Z1", function(){

	 // 			test("Z1a", function(){});

	 // 			test("Z1b", function(){});
	 // 		});

	 // 		test("Z2", function(){
	 // 			test("Z2a", function(){});

	 // 			test("Z2b", function(){});
	 // 		});
	 // 	});
		// console.log("B C tweener");

		// test("C", function(){
		// 	console.log("C starter");
		// 	obj.prop = 5;

		// 	test("C1", function(){
		// 		expect(obj.prop).toBe(5);
		// 	});

		// 	console.log("C1 C2 tweener");

		// 	test("C2", function(){
		// 		console.log("C2 starter");
		// 		obj.prop += 5;

		// 		test("C2a", function(){
		// 			expect(obj.prop).toBe(10);
		// 		});

		// 		console.log("C2a C2b tweener");

		// 		test("C2b", function(){
		// 			obj.prop += 5;
		// 			expect(obj.prop).toBe(15);
		// 		});

		// 		console.log("C2 ender");
		// 	});

		// 	console.log("C ender");
		// });

		console.log("root ender");
	});	
});
