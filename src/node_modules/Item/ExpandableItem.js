var Item = require("./Item");
var is = require("../is");
var $ = require("jquery");

var ExpandableItem = Item.extend({
	addClass: "expandable",
	render: function(){
		if (this.active){
			this.get_captured(); // get captured by captor
			this.render_preview();
			this.render_content();
		}
		return this;
	},
	add_content: function(child){
		child.$el.appendTo(this.$content);
	},
	render_preview: function(){
		this.$preview = $("<div></div>").addClass("preview").prependTo(this.$el).click(this.preview_click.bind(this));
		this.capture("preview");
	},
	preview_click: function(){
		this.$content.slideToggle(50);
	},
	add_preview: function(view){
		view.$el.appendTo(this.$preview);
	},
	preview: function(){
		this.icon.render();
		this.label.render();
		this.value.render();
	},
	content: function(){
		// override point
	},
	render_content: function(){
		this.$content = $("<div></div>").addClass("content").appendTo(this.$el).hide();
		this.capture("content");
	}
});

module.exports = ExpandableItem;