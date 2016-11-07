var Base3 = require("../Base3/Base3");
// var Logged = require("../Base/Logged");
var track = require("../track/track");
var is = require("../is");
var $ = require("jquery");
var Property = require("../Property/Property");

var Set = require("../Base3/Set");

var View = module.exports = Base3.extend({
	name: "View",
	tag: "div",
	capturable: true,
	active: false,
	set: {
		other: function(view, val){
			view.content = val;
			view.active = true; 
		}
	},
	create: function(o){
		track(this);
		this.inst_el(this.constructor.prototype.$el);
		this.inst && this.inst(); // setup sub instances before .set
		this.set.apply(this, arguments);
		this.init && this.init();
	},
	inst_el: function($base_el){
		this.$el = $("<" + this.tag + ">").addClass($base_el.attr("class")).attr("style", $base_el.attr("style"));
	},
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
	render: function(){
		// this.render_el();
		if (this.active){
			this.get_captured(); // get captured by captor
			this.render_content();
		}
		return this;
	},
	render_el: function(){
		this.$el = $("<" + this.tag + ">").addClass(this.classes);
	},
	get_captured: function(){
		if (this.capturable && View.captor){
			this.active = true;
			View.captor.add(this);
		}
	},
	add_content: function(child){
		this.children.push(child);
		child.$el.appendTo(this.$el);
	},
	// this.capture(this.content);
	capture: function(methodName){
		var previousAdd = this.add;
		this.add = this["add_"+methodName];
		this.become_captor();
		this[methodName]();
		this.restore_captor();
		this.add = previousAdd;
	},
	render_content: function(){
		if (!is.def(this.content))
			return false;
		if (is.fn(this.content))
			this.capture("content");
		else if (is.str(this.content))
			this.$el.append(this.content).addClass("str-content");
		else if (is.num(this.content))
			this.$el.append(this.content).addClass("num-content");
		else if (is.bool(this.content))
			this.$el.append(this.content.toString()).addClass("bool-content");
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
}).assign({
	setup: false, // skip auto instantiation
	Extend: Base3.Extend.extend({
		instantiatePrototype: function(NewView, OldView){
			NewView.prototype.inst_el(OldView.prototype.$el);
		}
	}),
	set: new Set({
		main: function(ViewClass){
			var args = this.args(arguments); // chop off the first arg
			ViewClass.prototype.set.apply(ViewClass.prototype, args);
			return ViewClass; // important - why? I don't remember
		}
	}).fn
});

View.extend = new View.Extend().fn;

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


View.prototype.inst_el({ attr: function(){} })