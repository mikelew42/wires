var TestFramework = require("./TestFramework");
var test = TestFramework.test;
var $ = require("jquery");
var ValidationTest = require("./ValidationTest");

expect = function(a){
	return {
		toBe: function(b){
			console.assert(a === b, a, "===", b);
		}
	}
};

var index = 0, IDs = [
	1, 2, 3, 4, 5, // A
	1, 3, 6, 7, 8, 9, 10, 4, 5, // B1
	1, 3, 6, 8, 11, 9, 10, 4, 5, // B2
	1, 3, 6, 8, 9, 12, 10, 4, 5, // B3
	1, 3, 4, 13, 14, 15, 16, 17, 18, 19, 20, 5, // C1a
	1, 3, 4, 13, 14, 16, 21, 17, 18, 19, 20, 5, // C1b
	1, 3, 4, 13, 14, 16, 17, 22, 18, 19, 20, 5, // C1c
	1, 3, 4, 13, 19, 23, 24, 25, 26, 20, 5, // C2a
	1, 3, 4, 13, 19, 23, 25, 27, 26, 20, 5// C2b
];
var next = function(){
	return IDs[index++];
};

$(function(){
	// debugger;
	test("Root", function(){
		console.log("Root.setup");
		console.assert(next() === 1);

		test("A", function(){
			console.log("A");
			console.assert(next() === 2);
		});

		// console.log("root.A/B");
		console.assert(next() === 3);

		test("B", function(){
			console.log("B.setup");
			console.assert(next() == 6);

			test("B1", function(){
				console.log("B1");
				console.assert(next() === 7);
			});

			// console.log("B.B1/B2");
			console.assert(next() === 8);

			test("B2", function(){
				console.log("B2")
				console.assert(next() === 11);
			});

			// console.log("B.B2/B3");
			console.assert(next() === 9);

			test("B3", function(){
				console.log("B3");
				console.assert(next() === 12);
			});

			console.log("B.cleanup");
			console.assert(next() === 10);
		});
	 
		// console.log("root.B/C");
		console.assert(next() === 4);

		test("C", function(){
			console.log("C.setup");
			console.assert(next() === 13);

			test("C1", function(){
				console.log("C1.setup");
				console.assert(next() === 14);

				test("C1a", function(){
					console.log("C1a");
					console.assert(next() === 15);
				});

				// console.log("C1.C1a/C1b");
				console.assert(next() === 16);

				test("C1b", function(){
					console.log("C1b");
					console.assert(next() === 21);
				});

				// console.log("C1.C1b/C1c");
				console.assert(next() === 17);

				test("C1c", function(){
					console.log("C1c");
					console.assert(next() === 22);
				});

				console.log("C1.cleanup");
				console.assert(next() === 18);
			});

			// console.log("C.C1/C2");
			console.assert(next() === 19);

			test("C2", function(){
				console.log("C2.setup");
				console.assert(next() === 23);

				test("C2a", function(){
					console.log("C2a");
					console.assert(next() === 24);
				});

				// console.log("C2.C2a/C2b");
				console.assert(next() === 25);

				test("C2b", function(){
					console.log("C2b");
					console.assert(next() === 27);
				});

				console.log("C2.cleanup");
				console.assert(next() === 26);
			});

			console.log("C.cleanup");
			console.assert(next() === 20);
		});

		// test("D", function(){
		// 	test("D1", function(){
		// 		test("D1a", function(){
		// 			test("D1a1", function(){
		// 				test("D1a1a", function(){});
		// 				test("D1a1b", function(){});
		// 				test("D1a1c", function(){});
		// 			});
		// 		});
		// 	});
		// 	test("D2", function(){
		// 		test("D2a", function(){
		// 			test("D2a1", function(){
		// 				test("D2a1a", function(){});
		// 			});
		// 		});
		// 		test("D2b", function(){});
		// 		test("D2c", function(){});
		// 	});
		// 	test("D3", function(){});
		// });

		// test("E", function(){});

		console.log("Root.cleanup");
		console.assert(next() === 5);
	});	
});
