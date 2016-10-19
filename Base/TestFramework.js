var is = require("../is");
var Base = require("./Base");

var $ = require("jquery");

var $panel;
$(function(){
	$panel = $("<div>panel</div>").appendTo("body");
});

var current;

var Block = Base.extend({
	name: "Block",
	init: function(){
		if (!this.root)
			this.root = this;

		this.blocks = {}; // { block.name: block }
		this.children = []; // [block, block, ...] in order
		// this.execCount = 0; // ? is this needed?

		this.render();
	},
	render: function(){
		this.$el = $("<div>").addClass("block").text(this.name);
		this.$children = $("<div>").addClass("children").appendTo(this.$el);
		if (this.parent && this.parent.$el)
			this.$el.appendTo(this.parent.$el);
		else 
			this.$el.appendTo($panel);
	},
	add: function(name, fn){
		var block = this.blocks[name],
			newBlock;

		// has this block been registered?
		if (block){
			// is it next to be .exec()?
			if (block === this.next){
				// let's do it
				block.exec();
			} else {
				// it's probably .finished
				return false;
			}
		// nope, make a new one
		} else {
			newBlock = new Block({
				name: name,
				fn: fn,
				parent: this,
				root: this.root
			});

			// store by name
			this.blocks[name] = newBlock;

			// add to the ordered array, and add the index to the block
			newBlock.index = this.children.push(this.blocks[name]) - 1;

			// run first child immediately
			if (newBlock.index === 0)
				newBlock.exec();
		}
	},
	isRoot: function(){
		return this === this.root;
	},
	openLogGroup: function(){
		this.logGroupOpen = true;
		console.group(this.name);
	},
	closeLogGroup: function(){
		if (this.logGroupOpen){
			this.logGroupOpen = false;
			console.groupEnd();
		}
	},
	capture: function(){
		this.previous = current;
		current = this;
	},
	restore: function(){
		current = this.previous;
	},
	reExec: function(){
		this.reRun();
		this.findNext();
		this.conclude();
	},
	reRun: function(){
		this.capture();
		this.fn();
		this.restore();
	},
	run: function(suppressLog){
		this.capture();

		if (this.index === 0 || this.isRoot() )
			this.openLogGroup();
		
		// run the test
		this.fn();

		// keep root group open
		if (this.index === 0)
			this.closeLogGroup();

		this.restore();
	},
	findNext: function(){
		this.next = false;
		for (var i = 0; i < this.children.length; i++){
			if (!this.children[i].finished){
				this.next = this.children[i];
				break; // find the first unfinished child
			}
		}
	},
	conclude: function(){
		if (this.next){
			// first children have already been logged
			if (this.next.index !== 0){
				this.next.openLogGroup;
			}

			if (this.isRoot())
				this.reExec();
		} else {
			this.finished = true;
			this.closeLogGroup();
		}
	},
	exec: function(){
		this.run();
		this.findNext();
		this.conclude();
	},
	rerun: function(){} // override point for the rootblock below
});
/*
The RootBlocks need to loop through all their kids before ending...

Before, it was find next and then re-exec root.  When we're in the root, we just want to call exec?  or call run...

*/


var RootBlock = Block.extend({
	rerun: function(){}
})

current = new Block({
	name: "global",
	init: function(){
		this.rootBlocks = [];
	},
	add: function(name, fn){
		var block = new Block({
			name: name,
			fn: fn
		});

		block.exec();
	}
});

var test = exports.test = function(){
	return current.add.apply(current, arguments);
};

// var currentBlock;

// var RootBlock = Block2.extend({
// 	root: true
// });

// var Block = Base.extend({
// 	debug: true,
// 	verbose: true,
// 	name: "Block",
// 	init: function(){
// 		// console.group("init " + this.name);
// 		if (this.root)
// 			this.rootBlock = this;

// 		this.blocks = {};
// 		this.remaining = [];
// 		this.execCount = 0;
		
// 		if (this.autoExec){
// 			this.verbose && console.log(".init and .autoExec: " + this.name);
// 			this.logExec = true;
// 			this.exec();
// 		} else {
// 			this.logExec = false;
// 			this.verbose && console.log("init and skip: " + this.name);
// 		}

// 		// console.groupEnd();
// 	},
// 	reExec: function(){
// 		var previousCurrentBlock = currentBlock;
// 		currentBlock = this;

// 		this.debug && console.warn("Re-running: " + this.name);
// 		this.fn();
// 		this.debug && console.warn("Finished re-running: " + this.name);

// 		currentBlock = previousCurrentBlock;
// 	},
// 	execNextBlock: function(){
// 		// in order to exec the next child, we need to reExec all the parent blocks

// 		// when the rootBlock gets reExec(), the global "currentBlock" needs to be the global block....
// 		currentBlock = globalBlock;

// 		this.nextChild = this.remaining.shift();
// 		this.verbose && console.info("Next block: " + this.nextChild.name);

// 		// console.log(this.name + " .nextChild: " + this.nextChild.name);

// 		// console.info("this.rootBlock.reExec()");
// 		// the trick will be getting everyone to remember what to do
// 		this.verbose && console.debug("Pre-emptive grouping..");
// 		console.group(this.nextChild.name);
// 		this.rootBlock.reExec();
// 		console.groupEnd();
// 	},
// 	exec: function(){
// 		// switch to .reExec after first .exec
// 		if (this.execCount > 0){
// 			return this.reExec();
// 		} else {
// 			this.execCount++;
// 		}
// 		var previousCurrentBlock = currentBlock;
// 		currentBlock = this;

// 		this.logExec && console.group(this.name);
		
// 		// this is where the magic happens... where the blocks are re"added", and are checked if they're the "currentBlock".

// 		this.debug && console.warn("Running: " + this.name);
// 		this.firstPassComplete = true;
// 		this.fn();

// 		this.debug && console.warn("Finished running: " + this.name);

// 		// var nextParent = this.parent, i = 0;

// 		// if there is more than 1 child, then they're added to "remaining"
// 		var childLimit = 20, count = 0;
// 		if (this.remaining.length){
// 			while (this.remaining.length){
// 				count++;
// 				if (count > childLimit)
// 					break;
// 				this.verbose && console.debug(this.remaining.length + " remaining blocks for: " + this.name);
// 				this.execNextBlock();
// 			}

// 		} 

// 		// if no more children, this block will lapse, and its parent will have a chance to continue execution.
// 		this.verbose && console.info("No remaining blocks, finished: " + this.name);
// 		currentBlock = previousCurrentBlock;
// 		this.finished = true;

// 		// console.log("blocks for: " + this.name, this.blocks);

// 		this.logExec && console.groupEnd();
// 	},
// 	add: function(name, fn){
// 		var block;

// 		// block has already been registered
// 		if (name in this.blocks){
// 			block = this.blocks[name];

// 			// if it has completed, and if children, so have they
// 			if (block.finished){
// 				this.verbose && console.info("Re-adding already finished block, skipping: " + block.name);
// 				return false;
// 			}
// 			if (block === this.nextChild){
// 				if (block.firstPassComplete){
// 					this.verbose && console.debug("Found this.nextChild, secondary pass, reExec(): ", block.name);
// 					block.reExec();
// 				} else {
// 					this.verbose && console.debug("Found this.nextChild, first pass, exec(): ", block.name);
// 					block.exec();
// 				}
// 			} else {
// 				return false;
// 			}
// 		} else {
// 			this.verbose && console.info("Adding new block: \"" + name + "\" to: " + this.name);
// 			this.blocks[name] = new Block({
// 				name: name,
// 				fn: fn,
// 				parent: this,
// 				rootBlock: this.rootBlock,
// 				autoExec: !this.foundFirstChild // auto exec the first child
// 			});

// 			if (!this.foundFirstChild)
// 				this.foundFirstChild = true;
// 			else if (this.foundFirstChild)
// 				this.remaining.push(this.blocks[name]);
// 		}
// 	}
// });

// var GlobalBlock = Base.extend({
// 	name: "GlobalBlock",
// 	init: function(){
// 		this.rootBlocks = [];
// 	},
// 	add: function(name, fn){
// 		this.rootBlocks.push(new Block({
// 			name: name,
// 			fn: fn,
// 			root: true,
// 			autoExec: true 
// 		}));
// 	}
// });

// var globalBlock = currentBlock = new GlobalBlock({
// 	name: "globalBlock"
// });

// var test = exports.test = function(name, fn){
// 	return currentBlock.add.apply(currentBlock, arguments);
// };


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