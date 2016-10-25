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
		global: true,
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
	v2: true,
	name: "Block",
	init: function(){
		this.init_props();
		this.init_root();
		// render before register
		debug && this.render();
		this.init_register();
		// has to come before init_firstChild...
		this.v2 && this.init_conclude();

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
			this["$tag_" + tags[i]] = $("<div>").addClass("tag " + tags[i]).text(tags[i]).appendTo(this.$tags);
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

		if (this.v2){
			if (!this.global){
				if (block.index === 0)
					this.registerFirstChild();
				else if (block.index === 1)
					this.registerSecondChild(block);
			}
		}
	},
	reAdd: function(block){
		if (block.finished){
			return false;
		} else if (this.root.node.finished){
			return false;
		} else if (block === this.root.nextNodeAncestor()){
			return block.exec();
		} else if (block === this.root.node){
			return block.exec();
		} else {
			return false;
		}
	},
	add: function(name, fn){
		var block = this.blocks[name];
		if (block){
			return this.reAdd(block);
		} else {
			return new Block({
				name: name,
				fn: fn,
				parent: this
			}); 
		}
	},
	init_conclude: function(){
		// by default, change if needed
		this.conclude = this.finish;
	},
	nothing: function(){},
	registerFirstChild: function(){
		// this is important
			// if 0 children, this doesn't run, and default conclude => finish
			// if 1 child, and does finish, then we call notify, which resets conclude => finish
			// if 1 child, and does not finish, then we do nothing
		this.conclude = this.nothing;
		if (this.v2)
			this.notify2 = this.init_conclude;
		else
			this.notify = this.init_conclude; // or this.resetConclude? 
	},
	registerSecondChild: function(secondChild){
		// default conclude => finish, or, in the case of unfinished first child, then conclude => nothing
		// either way, we want to make sure conclude => nothing
		this.conclude = this.nothing;

		// only runs in "scan" mode, on first run...?  registerFirstChild vs reAddFirstChild
		// we don't know how many children we'll have, but we know we have at least a second
		// all that matters at this point, is.. first child finished?

		if (this.children[0].finished){
			if (this.root.nextNode)
				console.error("shouldn't have a nextNode if first child finished");

			this.root.setNextNode(secondChild);
			// this.conclude = this.nothing; // already done
		} else {
			// leave conclude => nothing
		}
	},
	notify2: function(child){
		console.group("notify for " + this.name);
		if (this.children[child.index + 1]){
			console.log("has nextChild");
			if (!this.root.nextNode){
				console.log("no nextNode, set to nextChild");
				this.root.setNextNode(this.children[child.index + 1]);
			} else {
				console.log("already have nextNode");
			}
		} else {
			console.log("no nextChild, .finish()");
			this.finish("notified");
		}
		console.groupEnd();
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
	concludeFirstRun: function(){
		console.group("concludeFirstRun for " + this.name);


		// false.  on repeat, we can still "dig", and conclude a child's first run, when the parent is in 2nd+ run.  these logs CAN and DO trigger notify actions...
		if (!this.children.length){
			this.finish("empty");
			console.log("empty");
		} else if (this.children.length === 1){
			if (this.children[0].finished){
				this.finish("1.finished");
				console.log("1.finished");
			} else {
				console.warn("1.unfinished");
			}
		} else if (this.children[1]){
			console.log("has 2nd child");
			if (!this.root.nextNode){
				console.log("no nextNode, setNextNode(2ndChild)");
				this.root.setNextNode(this.children[1]);
			} else {
				if (this.children[0].finished)
					console.error("if we have nextNode, that should mean first child didn't finish");
				console.warn("already have nextNode, do nothing");
			}
		}
		console.groupEnd();
	},

	// child notifies parent when child is finished
	notify: function(child){
		if (this.runCount > 1){
			console.group("notify for " + this.name);
			if (this.children[child.index + 1]){
				console.log("has nextChild");
				if (!this.root.nextNode){
					console.log("no nextNode, set to nextChild");
					this.root.setNextNode(this.children[child.index + 1]);
				} else {
					console.log("already have nextNode");
				}
			} else {
				console.log("no nextChild, .finish()");
				this.finish("notified");
			}
			console.groupEnd();
		}
	},
	finish: function(reason){

		this.finished = true;
		debug && this.$el.addClass("finished");
		debug && this.$tag_finished.append(" - " + reason);
		
		this.addToCleanup();
		
		if (this.v2){
			this.parent.notify2(this);
		} else {
			this.parent.notify(this);
		}
		
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
	conclude: function(){
		if (this.runCount === 1){
			this.concludeFirstRun();
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
		debugger;
		this.run();
		this.conclude();
		this.cleanup();
		this.done();
	},
	setNode: function(node){
		this.clearNode();
		debug && node.$el.addClass("node");
		this.node = node;
	},
	setNextNode: function(nextNode){
		// if (!this.nextNode){
			debug && nextNode.$el.addClass("nextNode");
			this.nextNode = nextNode;
		// }
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