var is = require("../is");
var Base = require("./Base");

var $ = require("jquery");
require("./testStyles.less");
var $panel;
$(function(){
	$panel = $("<div>panel</div>").appendTo("body");
});

var current;

var Block = Base.extend({
	name: "Block",
	init: function(){
		this.init_props();
		this.init_root();
		// render before register
		this.render();
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

		// add to parent
			// must happen within child.init instead of parent.addChild(new Block()), so that it gets registered BEFORE auto-exec (FirstChildBlock feature)
		this.parent.addChild(this);
	},
	render: function(){
		this.$el = $("<div>").addClass("block");
		this.$name = $("<div>").addClass("name").text(this.name).appendTo(this.$el);
		this.$icon = $("<div></div>").addClass("icon").prependTo(this.$el);

		this.$tags = $("<div></div>").addClass("tags").appendTo(this.$el);

		var tags = [
			"finished", "digging", "scanning", "repeating", "skipping", "node"
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

		// even for first children... this will get cleared when finished
		// if (!this.next)
		// 	this.setNext(block);
	},
	reAdd: function(block){
		if (block.finished)
			return false;
		else if (block === this.active)
			block.exec();
		else 
			return false;
	},
	newBlock: function(name, fn){
		var BlockType;

		if (this.children.length)
			BlockType = Block;
		else
			BlockType = FirstChildBlock;

		// the block will register itself
		new BlockType({
			name: name,
			fn: fn,
			parent: this
		});
	},
	add2: function(name, fn){
		var block = this.blocks[name];

		// has this block been registered?
		if (block)
			this.reAdd(block);

		// nope, make a new one
		else
			this.newBlock(name, fn);
	},
	add: function(name, fn){
		var block;

		if (this.repeating){
			block = this.blocks[name];
			if (block === this.root.nextNodeAncestor){
				block.repeat();
			} else if (block === this.root.node){
				block.dig();
			}
		} else if (this.digging){
			new FirstChildBlock({
				name: name,
				fn: fn,
				parent: this	
			});
		} else if (this.scanning){
			new Block({
				name: name,
				fn: fn,
				parent: this
			})
		} else if (this.skipping){
			return false;
		}
	},
	isRoot: function(){
		return this === this.root;
	},
	openLogGroup: function(){
		this.logGroupOpen = true;
		this.$el.addClass("open");
		console.group(this.name);
	},
	closeLogGroup: function(){
		if (this.logGroupOpen){
			this.logGroupOpen = false;
			this.$el.removeClass("open").addClass("closed");
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
	exec: function(){
		this.run();
		// this.findNext();
		this.conclude();
	},
	setNext: function(next){
		this.next && this.next.$el.removeClass("next");
		next && next.$el.addClass("next");
		this.next = next;
		if (next){
			this.root.setNode(next);
		}
	},
	activate: function(block){
		this.active = block;
		this.active.$el.addClass("active");
	},
	deactivate: function(){
		this.active && this.active.$el.removeClass("active");
		this.active = false;
		this.reactivate = true;
	},
	advance: function(){
		var next = this.children[this.next.index + 1];

		// when a child finishes and advances parent, we need to clear the active block, so that the .next block doesn't auto-exec 
		this.deactivate();

		if (next){
			this.setNext(next);
		} else {
			this.setNext(false);

			// on the 2nd+ pass, if there are no more children, we're finished
			if (this.runCount > 1)
				this.finish();
		}
	},
	dig: function(){
		this.root.clearNode();

		this.digging = true;
		this.$el.addClass("digging");

		this.run();

		this.finishDig();
	},
	finishDig: function(){
		this.digging = false;
		this.$el.removeClass("digging");

		this.scanning = false;
		this.$el.removeClass("scanning");

		if (this.parent.digging){
			this.parent.digging = false;
			this.parent.$el.removeClass("digging");
			
			this.parent.scanning = true;
			this.parent.$el.addClass("scanning");
		}

		if (!this.children.length){
			this.finish();
		} else if (this.children.length === 1){
			if (this.children[0].finished)
				this.finish();
		} else if (this.children[1]){
			this.root.setNode(this.children[1]);
		}
	},
	// child notifies parent when child is finished
	notify: function(){
		if (this.digging){

			this.digging = false;
			this.$el.removeClass("digging");

			this.scanning = true;
			this.$el.addClass("scanning");

		} else if (this.repeating){

			this.repeating = false;
			this.$el.removeClass("repeating");

			this.skipping = true;
			this.$el.addClass("skipping");
		}
	},
	finish: function(){
		this.finished = true;

		// we need to clear node before .parent.advance()
		if (this.root.node === this)
			this.root.clearNode();
		
		this.parent.notify();
		
		this.addToCleanup();
		
		this.$el.removeClass("digging repeating skipping scanning");
		this.$el.addClass("finished");
	},
	repeat: function(){
		this.repeating = true;
		this.$el.addClass("repeating");

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
		// always open group for First Child Block
			// although, if we remove logging... this doesn't need to happen
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
		return this.nodeAncestors[0]
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
		if (!this.node){
			this.node && this.node.$el.removeClass("node");
			node.$el.addClass("node");
			this.node = node;
		}
	},
	clearNode: function(){
		this.node && this.node.$el && this.node.$el.removeClass("node");
		this.node = false;
	},
	conclude: function(){
		if (this.node){
			this.execNode();
		} else {
			// this.finish();
			this.finished = true;
			this.closeLogGroup();
		}
	},
	finishRepeat: function(){
		this.conclude();
	},
	execNode: function(){
		this.findNodeAncestors();
		this.repeat();
	},
	findNodeAncestors: function(){
		var parent = this.node.parent;
		this.nodeAncestors = [];
		while (parent !== this){
			this.nodeAncestors.unshift(parent);
			parent = parent.parent;
		}
	}
});


current = new Base({
	name: "global",
	init: function(){
		this.rootBlocks = [];
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
	}
});

var test = exports.test = function(){
	return current.add.apply(current, arguments);
};