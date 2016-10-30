var Base3 = require("../Base3/Base3");
// var Logged = require("../Base/Logged");
var track = require("../track/track");
var is = require("../is");
var $ = require("jquery");

var View = module.exports = Base3.extend({
	name: "View",
	tag: "div",
	classes: "",
	set: new Base3.Set({
		str: function(mod, str){
			mod.content = str;
		}
	}).fn,
	init: function(){
		this.init_view();
	},
	init_view: function(){
		this.children = [];
		
		if (this.autoRender !== false)
			this.render();

		if (this.autoInsert !== false)
			this.insert();
	},
	insertMethod: "append",
	insert: function(){
		if (this.$container) // $container could be a view with aliased insertMethod
			this.$container[this.insertMethod](this.$el);
	},
	add: function(child){
		this.children.push(child);
		child.$el.appendTo(this.$el);
	},
	render: function(){
		this.render_el();
		this.captured(); // get captured by captor
		this.render_content();
		return this;
	},
	captured: function(){
		if (View.captor)
			View.captor.add(this);
	},
	render_el: function(){
		this.$el = $("<" + this.tag + ">").addClass(this.classes);
	},
	render_content: function(){
		if (!is.def(this.content))
			return false;
		if (is.fn(this.content))
			this.capture_content();
		else if (is.str(this.content))
			this.$el.append(this.content);
		else
			console.error("not supported");
	},
	// capture: function(fn){ // how to capture the created views into a secondary.. $el, or array, or..?
	// 	var returned;
	// 	this.become_captor();
	// 	returned = fn.call(this);
	// 	this.restore_captor();
	// },
	capture_content: function(){
		var content;
		this.become_captor();
		content = this.content(); // allow return values from content function
		if (content){
			if (is.str(content))
				this.$el.append(content)
			else
				console.error("not yet supported");
			// how do we handle str, DOM, View, function?, Value/Property binding, etc..
		}
		this.restore_captor();
	},
	become_captor: function(){
		this.previous_captor = View.captor;
		View.captor = this;
	},
	restore_captor: function(){
		View.captor = this.previous_captor;
	}
});

var aliasFnToEl = function(fn){
	return function(){
		this.$el[fn].apply(this.$el, arguments);
		return this;
	};
};

[	'append', 'prepend', 'click', /* 'clickOff',*/ 'show', 'hide', 'appendTo', 'prependTo', 'addClass', 'removeClass', 
	'css', 'attr', 'remove', 'empty', 'hasClass', 'html'].forEach(function(v){
		View.prototype[v] = aliasFnToEl(v);
});