var is = require("../is");
var Base = require("./Base");

var $ = require("jquery");

require("./testStyles.less");

var debug = true;


var $panel;
$(function(){
	if (debug)
		$panel = $("<div>TestFramework debug panel</div>").appendTo("body");
});


var current;

var Block = Base.extend({
	name: "Block",
	init: function(){
		this.init_props();
		this.init_root();
		// render before register
		debug && this.render();
		this.init_register();
	},
	init_props: function(){
		this.blocks = {}; // { block.name: block }
		this.children = []; // [block, block, ...] in order
		this.runCount = 0;
	},
	init_root: function(){
		this.root = this.parent.root;
	},
	init_register: function(){
		// store blocks by name
		this.parent.blocks[this.name] = this;

		// add child to parent
		this.parent.addChild(this);
	},
	render: function(){
		this.$el = $("<div>").addClass("block");
		this.$name = $("<div>").addClass("name").text(this.name).appendTo(this.$el);
		this.$icon = $("<div></div>").addClass("icon").prependTo(this.$el);

		this.$tags = $("<div></div>").addClass("tags").appendTo(this.$el);

		var tags = [
			"finished", "digging", "scanning", "repeating", "skipping", "node", "nextNode"
		];

		for (var i = 0; i < tags.length; i++){
			this.$tags.append( $("<div>").addClass("tag " + tags[i]).text(tags[i]) );
		}

		// this.$children = $("<div>").addClass("children").appendTo(this.$el);
		if (this.parent && this.parent.renderChildContainer){
			this.parent.renderChildContainer();
			this.$el.appendTo(this.parent.$children);
		}
		else 
			this.$el.appendTo($panel);
	},
	renderChildContainer: function(){
		this.$children = this.$children ||
			$("<div>").addClass("children").appendTo(this.$el);
	},
	addChild: function(block){
		// add to the children array, and store the index on the block
		block.index = this.children.push(block) - 1;
	},
	repeatOrDig: function(block){
		if (block.finished){
			return false;
		} else if (block === this.root.nextNodeAncestor()){
			return block.repeat();
		} else if (block === this.root.node){
			return block.dig();
		}

		debugger;

		// block may be finished (before the nextNodeAncestor)
		// or after the nextNodeAncestor (to be run in the future)
			// we can just let these fall through...

			// i could make a "skip" tag that appears when a block is skipped, and disappears on the next iteration
	},
	add: function(name, fn){
		var block;

		if (this.finished){
			// I don't think this ever runs
			return false;
		} else if (this.runCount === 0){
			console.error("this shouldn't happen");
		} else if (this.runCount === 1){
			if (this.children.length){
				if (!this.scanning)
					console.error("whoops");
				return new Block({
					name: name,
					fn: fn,
					parent: this
				})
			} else {
				if (!this.digging)
					console.error("whoops");
				return new FirstChildBlock({
					name: name,
					fn: fn,
					parent: this
				});
			}
		} else {
			// runCount > 1
			if (this.skipping)
				return false;
			else 
				return this.repeatOrDig(this.blocks[name]);
		}
		
		// // this.repeating
		// } else if (this.runCount > 1){ // && !this.finished
		// 	if (!this.repeating){
		// 		if (this.skipping)
		// 			return false;
		// 		debugger;
		// 		console.log({
		// 			digging: this.digging,
		// 			scanning: this.scanning,
		// 			repeating: this.repeating,
		// 			skipping: this.skipping,
		// 			finished: this.finished
		// 		});
		// 	}
		// 	this.repeatOrDig(this.blocks[name]);

		// // this.digging
		// // this.runCount === 1
		// // hmm, not sure if this is correct
		// } else if (this.digging){
		// 	new FirstChildBlock({
		// 		name: name,
		// 		fn: fn,
		// 		parent: this	
		// 	});

		// // this.runCount === 1 && this.children.length (1+)
		// } else if (this.scanning){
		// 	new Block({
		// 		name: name,
		// 		fn: fn,
		// 		parent: this
		// 	});

		// // this.node === finished??  but we clear the node immediately
		// // 
		// } else if (this.skipping){
		// 	return false;
		// }
	},
	isRoot: function(){
		return this === this.root;
	},
	openLogGroup: function(){
		this.logGroupOpen = true;
		debug && this.$el.addClass("open");
		console.group(this.name);
	},
	closeLogGroup: function(){
		if (this.logGroupOpen){
			this.logGroupOpen = false;
			debug && this.$el.removeClass("open").addClass("closed");
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
	track: function(){
		if (this.runCount > 20){
			console.error("Burnout.");
			throw "Burnout!!!"
		}
		this.runCount++;
	},

	run: function(suppressLog){
		this.track();
		this.capture();
		// run the block fn
		this.fn();
		this.restore();
	},
	conclude: function(){
		if (!this.children.length){
			this.finish();
		} else {
			if (this.reactivate){
				this.reactivate = false;
				this.activate(this.next);
			}
		}
	},
	addToCleanup: function(){
		this.root.blocksToClean.push(this);
	},
	// exec: function(){
	// 	this.run();
	// 	// this.findNext();
	// 	this.conclude();
	// },
	// setNext: function(next){
	// 	this.next && this.next.$el.removeClass("next");
	// 	next && next.$el.addClass("next");
	// 	this.next = next;
	// 	if (next){
	// 		this.root.setNode(next);
	// 	}
	// },
	// activate: function(block){
	// 	this.active = block;
	// 	this.active.$el.addClass("active");
	// },
	// deactivate: function(){
	// 	this.active && this.active.$el.removeClass("active");
	// 	this.active = false;
	// 	this.reactivate = true;
	// },
	// advance: function(){
	// 	var next = this.children[this.next.index + 1];

	// 	// when a child finishes and advances parent, we need to clear the active block, so that the .next block doesn't auto-exec 
	// 	this.deactivate();

	// 	if (next){
	// 		this.setNext(next);
	// 	} else {
	// 		this.setNext(false);

	// 		// on the 2nd+ pass, if there are no more children, we're finished
	// 		if (this.runCount > 1)
	// 			this.finish();
	// 	}
	// },
	dig: function(){
		if (this.root.nextNode){
			this.root.clearNextNode();
			console.error("this shouldn't be necessary");
		}

		this.digging = true;
		debug && this.$el.addClass("digging");

		this.run();

		this.finishDig();
	},
	finishDig: function(){
		this.digging = false;
		debug && this.$el.removeClass("digging");

		this.scanning = false;
		debug && this.$el.removeClass("scanning");

		// if (this.parent.digging){
		// 	this.parent.digging = false;
		// 	this.parent.$el.removeClass("digging");
			
		// 	this.parent.scanning = true;
		// 	this.parent.$el.addClass("scanning");
		// }

		if (!this.children.length){
			this.finish();
		} else if (this.children.length === 1){
			if (this.children[0].finished)
				this.finish();
		} else if (this.children[1]){
			this.root.setNextNode(this.children[1]);
			this.parent.skip && this.parent.skip();
		}
	},
	skip: function(){
		if (this.digging){

			this.digging = false;
			debug && this.$el.removeClass("digging");

			this.scanning = true;
			debug && this.$el.addClass("scanning");

		} else if (this.repeating){
			this.repeating = false;
			debug && this.$el.removeClass("repeating");

			this.skipping = true;
			debug && this.$el.addClass("skipping");
		}
	},
	// child notifies parent when child is finished
	notify: function(child){
		if (this.digging){

			this.digging = false;
			debug && this.$el.removeClass("digging");

			this.scanning = true;
			debug && this.$el.addClass("scanning");

		} else if (this.repeating){
			this.repeating = false;
			debug && this.$el.removeClass("repeating");

			this.skipping = true;
			debug && this.$el.addClass("skipping");

			// this means the parent is repeating, and has already scanned.. and might have remaining children..
			if (this.children[child.index + 1]){
				this.root.setNextNode(this.children[child.index + 1]);
			} else {
				this.finish();
			}
		}
	},
	finish: function(){
		this.finished = true;

		if (this.root.node === this)
			this.root.clearNode();
		
		this.parent.notify(this);
		
		this.addToCleanup();
		
		this.skipping = this.digging = this.repeating = this.scanning = false;
		debug && this.$el.removeClass("digging repeating skipping scanning");
		debug && this.$el.addClass("finished");
	},
	repeat: function(){
		if (this === this.root.nextNodeAncestor()){
			this.root.nodeAncestors.pop();
		}
		this.repeating = true;
		debug && this.$el.addClass("repeating");

		this.skipping = false;
		debug && this.$el.removeClass("skipping");

		this.run();
		this.finishRepeat();
	},
	finishRepeat: function(){
		
	}
});

var FirstChildBlock = Block.extend({
	name: "FirstChildBlock",
	first: true,
	init: function(){
		// access to the base prototype is dangerous
		this.constructor.base.prototype.init.call(this);

		// always auto exec first child
		this.dig();
	},
	run: function(){
		this.track();
		this.capture();

		if (!this.repeating)
			this.openLogGroup();
		this.fn();
		this.restore();
	}
});

var RootBlock = Block.extend({
	name: "RootBlock",
	init_root: function(){
		this.root = this;
	},
	init_props: function(){
		this.constructor.base.prototype.init_props.call(this);
		this.blocksToClean = [];
	},
	init_register: function(){},
	nextNodeAncestor: function(){
		return this.nodeAncestors[this.nodeAncestors.length - 1];
	},
	run: function(){
		this.track();

		// should we open Root log group from the globalBlock / Block Manager?
		if (this.runCount === 1){
			this.openLogGroup();
		}

		if (this.node){
			this.node.openLogGroup();
		}
		
		this.capture();
		this.fn();
		this.restore();
	},
	cleanup: function(){
		for (var i = 0; i < this.blocksToClean.length; i++){
			this.blocksToClean[i].closeLogGroup();
		}
		this.blocksToClean = [];
	},
	exec: function(){
		this.run();
		this.cleanup();
		this.conclude();
	},
	execRoot: function(){
		this.dig();
		this.cleanup();
		this.conclude();
	},
	setNode: function(node){
		this.clearNode();
		debug && node.$el.addClass("node");
		this.node = node;
		this.findNodeAncestors();
	},
	setNextNode: function(nextNode){
		if (!this.nextNode){
			debug && nextNode.$el.addClass("nextNode");
			this.nextNode = nextNode;
		}
	},
	clearNode: function(){
		debug && this.node && this.node.$el && this.node.$el.removeClass("node");
		this.node = false;
		this.nodeAncestors = [];
	},
	clearNextNode: function(){
		debug && this.nextNode && this.nextNode.$el && this.nextNode.$el.removeClass("nextNode");
		this.nextNode = false;
	},
	conclude: function(){
		if (this.nextNode){
			this.setNode(this.nextNode);
			this.clearNextNode();
			this.repeat();
		} else {
			// this.finish();
			this.finished = true;
			this.closeLogGroup();
		}
	},
	finishRepeat: function(){
		this.cleanup();
		this.conclude();
	},
	// execNode: function(){
	// 	this.findNodeAncestors();
	// 	this.repeat();
	// },
	findNodeAncestors: function(){
		var parent = this.node.parent;
		this.nodeAncestors = [];
		while (parent !== this){
			this.nodeAncestors.push(parent);
			parent = parent.parent;
		}
	}
});


current = new Base({
	name: "global",
	init: function(){
		this.rootBlocks = [];
		if (debug)
			this.$el = $("<div></div>");
	},
	add: function(name, fn){
		var block = new RootBlock({
			name: name,
			fn: fn,
			parent: this
		});

		this.rootBlocks.push(block);

		block.execRoot();
	},
	notify: function(){}
});

var test = exports.test = function(){
	return current.add.apply(current, arguments);
};