var Base = require("../Base");
var Logged = require("../Base/Logged");
var track = require("../Base/track");

var View = module.exports = Logged.extend({
	name: "View",
	create: function(){
		track(this);
		this.inst && this.inst();
		this.assign.apply(this, arguments);
		this.init && this.init();
	},
	init: function(){
		this.initView();
	},
	initView: function(){
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