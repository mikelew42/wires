var app = require("app");

var Item = require("Item/ExpandableItem");

var View = app.View, Div = View.Div, p = View.p, h1 = View.h1, h2 = View.h2, h3 = View.h3, Row = View.Row, Col = View.Col, Col50 = View.Col50, Col33 = View.Col33, Col66 = View.Col66;

app.Page({
	name: "style_tests",
	pathname: "style-tests",
	title: "Style Tests",
	addClass: "page-style-tests",
	content: function(){
		this.header();
		this.boxes();
		this.two();
		this.three();
		this.test();
		this.test2();
		this.test2("200px");
		this.test2("400px");
	},
	boxes: function(){
		Div("boxes", function(){
			this.css({
				background: "white",
				color: "black",
				padding: "1em"
			});
			this.append("yep");
			Item({
				icon: "beer",
				label: "An expandable item",
				content: function(){
					this.append("yep");
				}
			})
		});
	},
	header: function(){
		this.$header = View({
			tag: "header",
			addClass: "header1 row",
			content: function(){
				Col50(function(){
					this.addClass("left");
					this.append("some svg or something");
				});

				Col50(function(){
					this.addClass("right");
					this.append("align-right");
				});
			}
		})
	},
	half: function(){
		Col50(function(){
			this.filler("1-3s");
		});
	},
	two: function(){
		var page = this;
		h2("Two columns").addClass("x");
		Row(function(){
			page.half();
			page.half();
			this.css("margin-bottom", "2em");
		});
	},
	third: function(){
		Col33(function(){
			this.filler("1-3s");
		});
	},
	three: function(){
		var page = this;
		h2("Three columns");
		Row(function(){
			page.third();
			page.third();
			page.third();
			this.css("margin-bottom", "2em");
		});
	},
	test: function(){
		var page = this;
		h2("Test");
		Row(function(){
			Col(function(){
				h3("flex-basis: 200px, flex-grow: 0, flex-shrink: 0")
				this.filler("1-3s");
				this.css("flex-basis", "200px");
				this.css("flex-grow", "0");
				this.css("flex-shrink", "0");
			});
			Col(function(){
				h3("flex-grow: 1");
				this.css("flex-grow", "1");
				this.filler("3-5s");

			});
		});
	},
	test2: function(width){
		var page = this;
		h2("Test2: flex-shrink + flex-grow");
		Row(function(){
			Col(function(){
				// h3("flex-shrink: 2")
				// this.filler("1-3s");
				this.css("flex-shrink", "2");
				View(function(){
					width && this.css("width", width);
					h3("width: " + width);
					p("Whatever the width of this container, the columns should automatically adapt.  That could be good or bad.")	
				});
			});
			Col(function(){
				h3("flex-grow: 1");
				this.css("flex-grow", "1");
				this.filler("3-5s");

			});
		});
	}
});