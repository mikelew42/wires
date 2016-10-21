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
		// this.$children = $("<div>").addClass("children").appendTo(this.$el);
		if (this.parent){
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
		if (!this.next)
			this.setNext(block);
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
	add: function(name, fn){
		var block = this.blocks[name];

		// has this block been registered?
		if (block)
			this.reAdd(block);

		// nope, make a new one
		else
			this.newBlock(name, fn);
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
			if (this.reactivate)
				this.activate(this.next);
		}
	},
	finish: function(){
		this.finished = true;

		// we need to clear node before .parent.advance()
		if (this.root.node === this)
			this.root.clearNode();
		
		this.parent.advance();
		
		this.addToCleanup();
		
		this.$el.addClass("finished");
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
	}
});

var FirstChildBlock = Block.extend({
	name: "FirstChildBlock",
	first: true,
	init: function(){
		// access to the base prototype is dangerous
		this.constructor.base.prototype.init.call(this);

		// always auto exec first child
		this.exec();
	},
	run: function(){
		this.track();
		this.capture();
		// always open group for First Child Block
			// although, if we remove logging... this doesn't need to happen
		this.openLogGroup();
		this.fn();
		this.restore();
	},
	finish: function(){
		this.finished = true;

		if (this.root.node === this)
			this.root.clearNode();

		this.parent.advance();
		// this.addToCleanup();
		this.closeLogGroup();

		this.$el.addClass("finished");
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
	setNode: function(node){
		if (!this.node || node.first){
			this.node && this.node.$el.removeClass("node");
			node.$el.addClass("node");
			this.node = node;
		}
	},
	clearNode: function(){
		this.node.$el.removeClass("node");
		this.node = false;
	},
	conclude: function(){
		if (this.next){
			this.exec();
		} else {
			// this.finish();
			this.finished = true;
			this.closeLogGroup();
		}
	}
});


current = new Base({
	name: "global",
	init: function(){
		this.rootBlocks = [];
	},
	add: function(name, fn){
		var block = new RootBlock({
			name: name,
			fn: fn
		});

		this.rootBlocks.push(block);

		block.exec();
	}
});

var test = exports.test = function(){
	return current.add.apply(current, arguments);
};