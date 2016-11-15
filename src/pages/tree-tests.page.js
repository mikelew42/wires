var app = require("app");

var Item = require("Item");

var View = app.View, Div = View.Div, p = View.p, h1 = View.h1, h2 = View.h2, h3 = View.h3, Row = View.Row, Col = View.Col, Col50 = View.Col50, Col33 = View.Col33, Col66 = View.Col66;

var InfCols = Row.extend({
	addClass: "inf-cols",
	launch: function($el){
		console.log("cols.launch");
		this.current.remove();
		this.current = $el;
		this.append($el);
	}
});

var ListItem = Item.extend({
	value: ">",
	icon: "circle",
	inst: function(){
		this.constructor.base.prototype.inst.call(this);
		this.panel = View({
			name: "ListItemPanel",
			addClass: "panel"
		});
	},
	render: function(){
		this.get_captured();
		this.render_content();
		this.behaviors();
	},
	behaviors: function(){
		this.click(this.launch.bind(this));
	},
	launch: function(){
		this.cols.launch(this.panel.$el);
	}
});

app.Page({
	name: "tree_tests",
	pathname: "tree-tests",
	title: "Tree Tests",
	addClass: "page-tree-tests",
	content: function(){
		InfCols(function(){
			var cols = this;
			ListItem({
				cols: cols,
				label: "Test1 - click me",
				panel: function(){
					View("This is the panel1 contents");
				}
			});

			ListItem({
				cols: cols,
				label: "Test2 - click me",
				panel: function(){
					View("This is the panel2 contents");

					// InfCols(function(){});
				}
			});
		});
	}
});