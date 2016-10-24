var is = require("../is");
var Base = require("./Base");

var $ = require("jquery");

require("./testStyles.less");

var debug = true, current;


var $body;
$(function(){
	if (debug)
		$body = $("body");

	// create this on doc.ready, so we can render it
	current = new Block({
		name: "Test Framework",
		init_root: function(){},
		init_register: function(){},
		add: function(name, fn){
			var block = new RootBlock({
				name: name,
				fn: fn,
				parent: this
			});

			// this.rootBlocks.push(block);

			// block.execRoot();
		},
		notify: function(){}
	});
});

var Block = Base.extend({
	name: "Block",
	init: function(){
		this.init_props();
		this.init_root();
		// render before register
		debug && this.render();
		this.init_register();

		this.init_firstChild();
	},
	init_firstChild: function(){
		if (this.index === 0){
			this.root.setNode(this);
			this.exec();
		}
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
			this.$el.appendTo($body);
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
			return block.exec();
		} else if (block === this.root.node){
			return block.exec();
		} else if (this.skipping){
			return false;
		}
	},
	add: function(name, fn){
		var block;

		if (this.runCount === 1){
			return new Block({
				name: name,
				fn: fn,
				parent: this
			})
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
		this.capture();
		this.fn();
		this.restore();
	},

	addToCleanup: function(){
		this.root.blocksToClean.push(this);
	},
	dig: function(){
		this.run();

		this.conclude();
	},
	finishDig: function(){
		if(this.runCount !== 1){
			debugger;
		}
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
		}
	},

	// child notifies parent when child is finished
	notify: function(child){
		
		if (this.runCount > 1){
			if (this.children[child.index + 1]){
				this.root.setNextNode(this.children[child.index + 1]);
			} else {
				this.finish();
			}
		}
	},
	finish: function(){
		// debugger;
		if (this.finished){
			debugger;
		}

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

		this.run();

		this.conclude();
		this.rootFinishRepeat();
	},
	prep: function(){
		this.track();
		this.advanceAncestor();
		this.openFirstChildGroup();
	},
	openFirstChildGroup: function(){
		// if first run of first child
		if (this.index === 0 && this.runCount === 1){
			this.openLogGroup();
		}
	},
	advanceAncestor: function(){
		if (this === this.root.nextNodeAncestor()){
			this.root.nodeAncestors.pop();
		}
	},
	exec: function(){
		this.prep();
		this.run();
		this.conclude();
	},
	rootFinishRepeat: function(){},
	conclude: function(){
		if (this.runCount === 1){
			this.finishDig();
		} else if (this.runCount > 1){
			// this.rootFinishRepeat();
		}
	}
});

var RootBlock = Block.extend({
	name: "RootBlock",
	init: function(){
		this.constructor.base.prototype.init.call(this);
		// this.parent.rootBlocks.push(this);
		this.setNode(this);
		this.exec();
		this.done();
	},
	init_firstChild: function(){},
	init_root: function(){
		this.root = this;
	},
	init_props: function(){
		this.constructor.base.prototype.init_props.call(this);
		this.blocksToClean = [];
	},
	nextNodeAncestor: function(){
		return this.nodeAncestors[this.nodeAncestors.length - 1];
	},
	runRoot: function(){
		this.track();

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
			// console.log("closing " + this.blocksToClean[i].name);
		}
		this.blocksToClean = [];
	},
	prep: function(){
		this.track();
		this.advanceAncestor();

		this.node.openLogGroup();
	},
	exec: function(){
		this.prep();
		this.run();
		this.conclude();
		this.cleanup();
		this.done();
	},
	execRoot: function(){
		this.setNode(this);
		this.dig();
		this.cleanup();
		this.rootConclude();
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
	rootConclude: function(){
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
	done: function(){
		if (this.nextNode){
			this.setNode(this.nextNode);
			this.findNodeAncestors();
			this.clearNextNode();
			this.exec();
		} else {
			// this.finish();
			// finished vs complete vs ...?
			this.finished = true;
			// this.closeLogGroup();
		}
	},
	rootFinishRepeat: function(){
		this.cleanup();
		this.done();
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

var test = exports.test = function(){
	return current.add.apply(current, arguments);
};