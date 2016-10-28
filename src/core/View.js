var Base3 = require("../Base3/Base3");
// var Logged = require("../Base/Logged");
var track = require("../track/track");
var is = require("../is");

var View = module.exports = Base3.extend({
	name: "View",
	set: new Base3.Set({
		other: function(mod, arg){
			if (is.str(arg))
				mod.content = function(){
					return arg;
				};
		}
	}).fn,
	init: function(){
		this.init_view();
	},
	init_view: function(){
		if (this.autoRender !== false)
			this.render();

		if (this.autoInsert !== false)
			this.insert();
	},
	insertMethod: "appendTo",
	insert: function(){
		if (this.$container) // $container could be a view with aliased insertMethod
			this.$container[this.insertMethod](this.$el);
	},
	render: function(){}
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