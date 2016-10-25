var View = require("../core/View");
var $ = require("jquery");

var Tab = View.extend({
	name: "Tab",
	init: function(){
		this.clickHandler = this.clickHandler.bind(this);

		this.render();
		this.$el.appendTo(this.tabs.$contents);
		this.$tab.appendTo(this.tabs.$tabs);
	},
	render: function(){
		this.$el = $("<div>").addClass("tab-content");
		this.$tab = $("<div>").addClass("tab-tab").html(this.label).click(this.clickHandler);
	},
	clickHandler: function(){
		this.tabs.activateTab(this);
	},
	activate: function(){
		this.show();
		this.$tab.addClass("active").removeClass("inactive");
		this.$el.addClass("active").removeClass("inactive");
	},
	deactivate: function(){
		this.hide();
		this.$tab.addClass("inactive").removeClass("active");
		this.$el.addClass("inactive").removeClass("active");
	}
});

var Tabs = View.extend({
	name: "Tabs",
	init: function(){
		this.tabs = [];
		this.render();
	},
	render: function(){
		this.$el = $("<div>").addClass("tabs");
		this.$tabs = $("<div>").addClass("tabs-tabs").appendTo(this.$el);
		this.$contents = $("<div>").addClass("tabs-content").appendTo(this.$el);
	},
	addTabs: function(dict){
		var tab;
		for (var i in dict){
			tab = new Tab(dict[i], {tabs: this});
			if (!this.tabs.length)
				tab.activate();
			else
				tab.deactivate();
			this[i] = tab;
			this.tabs.push(tab);
		}
		return this;
	},
	activateTab: function(tab){
		for (var i = 0; i < this.tabs.length; i++){
			this.tabs[i].deactivate();
		}
		tab.activate();
	}
});

module.exports = Tabs;