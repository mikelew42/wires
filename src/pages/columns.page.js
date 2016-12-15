var app = require("app");

var Div = app.Page.Div.extend({
	filler: function(quantity){
		this.attr("data-lorem", quantity);
	}
});
var View = app.View;
var p = View.extend({
	tag: "p"
});
var h1 = View.extend({
	tag: "h1"
});
var h2 = View.extend({
	tag: "h2"
});
var h3 = View.extend({
	tag: "h3"
});
/*
el("p", "content");
el("div", function(){});
el("div.whatever", "content" || fn(){});
el(".whatever"); // default to div

block(".whatever.two", function(){});


span("Here's some text ", another_page.link(), " and following text.");
// --> append all
*/
var Fillable = View.extend({
	filler: function(quantity){
		this.attr("data-lorem", quantity);
	}
})

var Row = View.extend({
	addClass: "row"
});

var Col = Fillable.extend({
	addClass: "col"
});

var Col50 = Col.extend({
	addClass: "col-50"
});

var Col33 = Col.extend({
	addClass: "col-33"
});

var Col66 = Col.extend({
	addClass: "col-66"
});

app.Page({
	name: "columns",
	pathname: "columns",
	title: "Columns",
	addClass: "page-columns wires",
	content: function(){
		this.two();
		this.three();
		this.test();
		this.test2();
		this.test2("200px");
		this.test2("400px");
	},
	half: function(){
		Col50(function(){
			this.filler("1-3s");
		});
	},
	two: function(){
		var page = this;
		h2("Two columns");
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