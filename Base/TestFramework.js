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
		this.$name = $("<div>").addClass("name").text(this.name + " - ").appendTo(this.$el);
		this.$count = $("<span></span>").text(this.runCount).appendTo(this.$name);
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
		} else if (this.root.node.finished){
			return false;
		} else if (block === this.root.nextNodeAncestor()){
			return block.repeat();
		} else if (block === this.root.node){
			return block.dig();
		} else if (this.skipping){
			return false;
		}

		// block may be finished (before the nextNodeAncestor)
		// or after the nextNodeAncestor (to be run in the future)
			// we can just let these fall through...

			// i could make a "skip" tag that appears when a block is skipped, and disappears on the next iteration
	},
	add: function(name, fn){
		var block;

		if (this.finished){
			debugger;
			return false;
		} else if (this.runCount === 0){
			debugger;
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
			return this.repeatOrDig(this.blocks[name]);
		}
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
		} else {
			debugger;
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
		this.$count.text(this.runCount);
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
			debugger;

			this.digging = false;
			debug && this.$el.removeClass("digging");

			this.scanning = true;
			debug && this.$el.addClass("scanning");

		} else if (this.repeating){
			debugger; 
			
			this.repeating = false;
			debug && this.$el.removeClass("repeating");

			this.skipping = true;
			debug && this.$el.addClass("skipping");
		}
	},
	// child notifies parent when child is finished
	notify: function(child){
		if (this.digging){
			debugger;

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
		} else {
			debugger;
		}
	},
	finish: function(){
		this.finished = true;

		// if (this.root.node === this)
		// 	this.root.clearNode();
		this.addToCleanup();
		
		this.parent.notify(this);
		
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

		// when we find a first child, the parent is currently the node, and digging. here, we want to set this as node..
		this.root.setNode(this);

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
		this.setNode(this);
		this.dig();
		this.cleanup();
		this.conclude();
	},
	setNode: function(node){
		this.clearNode();
		debug && node.$el.addClass("node");
		this.node = node;
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
			this.findNodeAncestors();
			this.clearNextNode();
			this.repeat();
		} else {
			// this.finish();
			// finished vs complete vs ...?
			this.finished = true;
			// this.closeLogGroup();
		}
	},
	finishRepeat: function(){
		this.cleanup();
		this.conclude();
	},
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