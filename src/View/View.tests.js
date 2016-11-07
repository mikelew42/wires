var TestFramework = require("../test/framework");
var test = TestFramework.test;
var assert = console.assert.bind(console);
var is = require("../is");
var $ = require("jquery");
var View = require("./View");

assert(View.setup === false);

var xtest = function(){};

TestFramework.View = View;

$(function(){

var Div = View.extend({
	Extend: {
		recursiveExtend: function(Ext, Base, args){
			var arg, propValue, setter, name;
			if (args.length === 2 && is.str(args[0]) && is.fn(args[1])){
				Ext.prototype.set(args[0], args[1]);
			} else {
				return this.constructor.base.prototype.recursiveExtend.apply(this, arguments);
			}
		}
	},
	set: {
		main: function(div){
			var args = this.args(arguments);
			if (args.length === 2 && is.str(args[0]) && is.fn(args[1])){
				this.strFnSpecial(div, args[0], args[1]);
			} else {
				this.constructor.base.prototype.main.apply(this, arguments);
			}
			return div;
		},
		strFnSpecial: function(div, str, fn){
			div.name = this.nameFromClasses(str);
			div.addClass(str);
			div.content = fn;
			div.active = true;
		},
		nameFromClasses: function(classes){
			// classes is string
			var classParts = classes.split(" ");
			return classParts[0];
		}
	}
});

test("Div", function(){
	
	xtest("usage", function(){
		Div("hello world");

		Div("hello", function(){
			Div("con", "tent");
			Div("content");
			Div("content").css("color", "blue");
			Div(function(){
				this.css("padding", "10px");
				this.append("one");
				this.append("two");
				Div("test?");
			});
		});
	});

	test("just content", function(){
		Div("hello world"); 
	});

	test("classes and content", function(){
		Div("my_section", function(){
			this.append(this.name);
		});
	});

	test("extend", function(){
		// var Something = Div.extend();
		test("simple", function(){
			var Div2 = Div.extend("default content");
			Div2();
		});

		test("simple2", function(){
			var Div2 = Div.extend("nameClass class2", function(){
				this.append("hello world");
			});
			Div2();
		});

		test("standard extenders", function(){
			var Div2 = Div.extend({
				active: true,
				addClass: "huh",
				css: {
					padding: "4px 8px",
					background: "#eee",
					margin: "0 0 3px"
				},
				Sub1: Div.extend({
					addClass: "sub1",
					css: ["font-weight", "bold"]
				}),
				Sub2: Div.extend({ addClass: "sub2" }),
				content: function(){
					this.append("huh?");
					this.Sub1(); // no content --> no show
					this.Sub2("content");
				}
			});

			Div2();

			var Div3 = Div2.extend({
				removeClass: "huh",
				addClass: "nuuuh",
				Sub1: "new content",
				Sub2: {
					css: {
						fontWeight: "bold",
						color: "purple"
					}
				}
			});

			Div3();
		});

		test("messing around", function(){
			var WithContent = Div.extend("withContent class2", function(){
				Div("hello world");
			});
			var withContent = WithContent(function(){
				this.constructor.prototype.content();
				this.append("yo");
				Div("cruel world");
				this.append("diggity");
			});
		});
	});

});

});