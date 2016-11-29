var app = require("app");

var Item = require("Item");

var View = app.View, Div = View.Div, p = View.p, h1 = View.h1, h2 = View.h2, h3 = View.h3, Row = View.Row, Col = View.Col, Col50 = View.Col50, Col33 = View.Col33, Col66 = View.Col66;

require("./test.less");
require("./test2.less");


var InfCols = Row.extend({
	addClass: "inf-cols",
	launch: function($el, hide){
		// console.log("cols.launch");
		this.current && hide && this.current.hide();
		this.current = $el.show();
		this.append($el);
	}
});

var ListItem = Item.extend({
	Value: ">", // must extend Class, not instance, when extending parent Class
	addClass: "light",
	hideCurrent: true,
	inst: function(){
		// this.constructor.base.prototype.inst.call(this);
		this.panel = View({
			name: "ListItemPanel",
			addClass: "panel",
			autoRender: false
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
		this.panel.render();
		this.cols.launch(this.panel.$el, this.hideCurrent);
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
			Div("list", function(){
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

						InfCols(function(){
							var cols2 = this;

							Div("list", function(){
								ListItem({
									cols: cols2,
									label: "Test1 - click me",
									panel: function(){
										View("This is the panel1 contents");
									}
								});
								ListItem({
									cols: cols2,
									label: "Test2 - click me",
									panel: function(){
										View("This is the panel2 contents");
									}
								});
								ListItem({
									cols: cols2,
									label: "Test3 - click me",
									panel: function(){
										View("This is the panel3 contents");
									}
								});
							});
						});
					}
				});

				ListItem({
					cols: cols,
					label: "Test3 - click me",
					panel: function(){
						View("This is the panel3 contents");

						InfCols(function(){
							var cols2 = this;

							Div("list", function(){
								ListItem({
									cols: cols,
									label: "Test1 - click me",
									panel: function(){
										View("This is the panel1 contents");
									},
									hideCurrent: false
								});
								ListItem({
									cols: cols,
									label: "Test2 - click me",
									panel: function(){
										View("This is the panel2 contents");
									}
								});
								ListItem({
									cols: cols,
									label: "Test3 - click me",
									panel: function(){
										View("This is the panel3 contents");
									}
								});
							});
						});
					}
				});	

				ListItem({
					cols: cols,
					label: "Test4 - click me",
					panel: function(){
						View("This is the panel4 contents");
					}
				});
			});
		});
	}
});