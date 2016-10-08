require("../jasmine");
var Logger = require("./Logger");

describe("Logger", function(){
	it("should create a logger", function(){
		var log = Logger();

		var myObj = {
			name: "myObj",
			myMethod: log.wrapMethod("myMethod", function(a, b, see){
				log.log(this.name+".myMethod()");
				return a + b * see;
			})
		};

		myObj.myMethod(1, 2, 3);

		var myObj2 = Object.create(myObj);
		myObj2.name = "myObj2";
		myObj2.myMethod(4, 5, 6);
	});
});