var is = require("../is");
var Base = require("./Base");

var currentBlock;

var describe = exports.describe = function(name, fn){
	return currentBlock.describe.apply(currentBlock, arguments);
};

var TestBlock = Base.extend({
	init: function(){
		this.blocks = {};
		this.specs = {};
		this.manifest = [];
		if (this.autoExec)
			this.exec();
	},
	exec: function(){
		var previousCurrentBlock = currentBlock;
		currentBlock = this;
		this.fn();
		currentBlock = previousCurrentBlock;
		this.parent.advance();
	},
	advance: function(){
		this.nextItem = 
	},
	describe: function(name, fn){
		var block;
		if (name in this.blocks){
			block = this.blocks[name];
			if (!this.nextItem || (block === this.nextItem))
				block.exec();
			else
				return false;
		} else {
			this.blocks[name] = new TestBlock({
				name: name,
				fn: fn,
				parent: this
			});

			this.manifest.push(this.blocks[name]);
			
			if (!this.noMoreSpecs)
				this.noMoreSpecs = true;
		}
	},
	it: function(name, fn){
		var spec;

		if (this.noMoreSpecs)
			return false;

		if (name in this.specs){
			spec = this.specs[name];
			if (!this.nextItem || (spec === this.nextItem)){
				spec.exec();
			} else {
				return false;
			}
		}

		spec = this.getSpec(name);

		if (spec){
			if (spec === this.nextItem){
				spec.exec();
			} else {
				return false;
			}
		} else {

		}
	},
	getNextItem: function(){
		for (var i = 0; i < this.manifest.length; i++){

		}
	},
	getSpec: function(name){
		for (var i = 0; i < this.specs.length; i++){
			if (this.specs[i].name === name){
				return this.specs[i];
			}
		}
	},
	getBlock: function(name){
		for (var i = 0; i < this.blocks.length; i++){
			if (this.blocks[i].name === name)
				return this.blocks[i];
		}
		return false;
	}
});

var it = exports.it = function(name, fn){
	return currentBlock.spec.apply(currentBlock, arguments);
};

var Spec = Base.extend({
	init: function(){}
});

var globalBlock = currentBlock = new TestBlock({
	describe: function(name, fn){
		this.blocks.push(new TestBlock({
			name: name,
			fn: fn,
			root: true,
			globalBlock: this,
			autoExec: true
		}));
	}
});