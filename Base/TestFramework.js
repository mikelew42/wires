var is = require("../is");
var Base = require("./Base");

var currentBlock;

var Block = Base.extend({
	name: "Block",
	init: function(){
		// console.group("init " + this.name);
		if (this.root)
			this.rootBlock = this;

		this.blocks = {};
		this.remaining = [];
		
		if (this.autoExec)
			this.exec();

		// console.groupEnd();
	},
	exec: function(){
		if (this.finished){
			console.warn("already finished " + this.name);
			return false;
		}
		var previousCurrentBlock = currentBlock;
		currentBlock = this;

		console.group(this.name);
		
		this.fn();

		var nextParent = this.parent, i = 0;

		// there are more children, and we need to re-exec all from the root down
		if (this.remaining.length){
			// console.log("2 or more children, re-exec full stack");
			// while (nextParent){
			// 	if (nextParent !== this.rootBlock){
			// 		i++;
			// 		nextParent = nextParent.parent;
			// 		console.groupEnd();
			// 	}
			// 	if (i > 15){
			// 		nextParent = false;
			// 	}

			// }
			console.groupEnd();
			// the rootBlock will store the currentBlock as previousCurrentBlock, and then restore it, using this same function.  
			currentBlock = this.globalBlock;

			this.currentBlock = this.remaining.shift();

			// the trick will be getting everyone to remember what to do
			this.rootBlock.exec();
		} else {
			// if no more children, this block will lapse, and its parent will have a chance to continue execution.
			console.info("finished " + this.name);
			currentBlock = previousCurrentBlock;
			this.finished = true;
		}

		console.groupEnd();
	},
	add: function(name, fn){
		var block;
		if (name in this.blocks){
			block = this.blocks[name];
			if (block.finished)
				return false;
			if (!this.currentBlock || (block === this.currentBlock))
				block.exec();
			else
				return false;
		} else {
			this.blocks[name] = new Block({
				name: name,
				fn: fn,
				parent: this,
				rootBlock: this.rootBlock,
				autoExec: !this.foundFirstChild // auto exec the first child
			});

			if (!this.foundFirstChild)
				this.foundFirstChild = true;
			else if (this.foundFirstChild)
				this.remaining.push(this.blocks[name]);
		}
	}
});

var GlobalBlock = Base.extend({
	name: "GlobalBlock",
	init: function(){
		this.rootBlocks = [];
	},
	add: function(name, fn){
		this.rootBlocks.push(new Block({
			name: name,
			fn: fn,
			root: true,
			globalBlock: this,
			autoExec: true 
		}));
	}
});

var globalBlock = currentBlock = new GlobalBlock({
	name: "globalBlock"
});

var test = exports.test = function(name, fn){
	return currentBlock.add.apply(currentBlock, arguments);
};


// var describe = exports.describe = function(name, fn){
// 	return currentBlock.describe.apply(currentBlock, arguments);
// };

// var TestBlock = Base.extend({
// 	init: function(){
// 		this.blocks = {};
// 		this.specs = {};
// 		this.manifest = [];
// 		if (this.autoExec)
// 			this.exec();
// 	},
// 	exec: function(){
// 		var previousCurrentBlock = currentBlock;
// 		currentBlock = this;
// 		this.fn();
// 		currentBlock = previousCurrentBlock;
// 		this.parent.advance();
// 	},
// 	advance: function(){
// 		this.nextItem = 
// 	},
// 	describe: function(name, fn){
// 		var block;
// 		if (name in this.blocks){
// 			block = this.blocks[name];
// 			if (!this.nextItem || (block === this.nextItem))
// 				block.exec();
// 			else
// 				return false;
// 		} else {
// 			this.blocks[name] = new TestBlock({
// 				name: name,
// 				fn: fn,
// 				parent: this
// 			});

// 			this.manifest.push(this.blocks[name]);
			
// 			if (!this.noMoreSpecs)
// 				this.noMoreSpecs = true;
// 		}
// 	},
// 	it: function(name, fn){
// 		var spec;

// 		if (this.noMoreSpecs)
// 			return false;

// 		if (name in this.specs){
// 			spec = this.specs[name];
// 			if (!this.nextItem || (spec === this.nextItem)){
// 				spec.exec();
// 			} else {
// 				return false;
// 			}
// 		}

// 		spec = this.getSpec(name);

// 		if (spec){
// 			if (spec === this.nextItem){
// 				spec.exec();
// 			} else {
// 				return false;
// 			}
// 		} else {

// 		}
// 	},
// 	getNextItem: function(){
// 		for (var i = 0; i < this.manifest.length; i++){

// 		}
// 	},
// 	getSpec: function(name){
// 		for (var i = 0; i < this.specs.length; i++){
// 			if (this.specs[i].name === name){
// 				return this.specs[i];
// 			}
// 		}
// 	},
// 	getBlock: function(name){
// 		for (var i = 0; i < this.blocks.length; i++){
// 			if (this.blocks[i].name === name)
// 				return this.blocks[i];
// 		}
// 		return false;
// 	}
// });

// var it = exports.it = function(name, fn){
// 	return currentBlock.spec.apply(currentBlock, arguments);
// };

// var Spec = Base.extend({
// 	init: function(){}
// });

// var globalBlock = currentBlock = new TestBlock({
// 	describe: function(name, fn){
// 		this.blocks.push(new TestBlock({
// 			name: name,
// 			fn: fn,
// 			root: true,
// 			globalBlock: this,
// 			autoExec: true
// 		}));
// 	}
// });