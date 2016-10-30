var is = require("../is");
var Base = require("../Base");
var router = require("../router");
var hash = require("../utils/utils").sanitizeString;

var View = require("../core/View");

var $ = require("jquery");

require("./styles.less");

var debug = true, current;


var $body;
$(function(){
	if (debug)
		$body = $("body");

	// create this on doc.ready, so we can render it
	current = new Block({
		name: router.activeRoute.pathname,
		global: true,
		init_route: function(){ return true; },
		init_url: function(){
			this.url = this.name
		},
		init_root: function(){},
		init_register: function(){},
		addBlock: function(name, fn){
			var block = new RootBlock({
				name: name,
				fn: fn,
				parent: this
			});

			// this.rootBlocks.push(block);

			// block.execRoot();
			return block;
		},
		notify: function(){},
		notify2: function(){}
	});
});

var Block = Base.extend({
	name: "Block",
	init: function(){
		this.init_props();
		this.init_root();

		// init url after init root
		this.init_url();

		if (!this.init_route())
			return false;

		// render before register
		debug && this.render();
		this.init_register();

		this.init_firstChild();
	},
	init_url: function(){
		this.hash = hash(this.name);
		var filePath = router.activeRoute.pathname;
		this.url = filePath;
		var parent = this.parent;
		var parentHashes = [];
		while(parent !== this.root){
			parentHashes.unshift(parent.hash);
			parent = parent.parent;
		}
		parentHashes.unshift(this.root.hash);

		for (var i = 0; i < parentHashes.length; i++){
			this.url += parentHashes[i] + "/";
		}

		this.url += this.hash + "/";
	},
	init_route: function(){
		var filePath = router.activeRoute.pathname;

		if (this.url.indexOf(window.location.pathname) === -1
			&& window.location.pathname.indexOf(this.url) === -1){
			
			return false;
		}

		if (this.url === window.location.pathname){
			this.chosen = true;
		}

		return true;
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
		this.$name = $("<a>").addClass("name").attr("href", this.url).text(this.name + " - ").appendTo(this.$el);
		this.$count = $("<span></span>").text(this.runCount).appendTo(this.$name);

		this.$tags = $("<div></div>").addClass("tags").appendTo(this.$el);

		if (this.chosen)
			this.$el.addClass("chosen");

		var tags = [
			"finished", "node", "nextNode"
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
	addBlock: function(name, fn){
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

		this.previous_view_captor = View.captor;
		View.captor = this;
	},
	restore: function(){
		current = this.previous;

		View.captor = this.previous_view_captor;
	},
	// conforming to View.captor.add() api...
	add: function(childView){
		this.renderChildContainer();
		childView.$el.appendTo(this.$children);
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
		if (!this.children.length){
			this.finish("empty");
		} else if (this.children.length === 1){
			if (this.children[0].finished){ // children[0] must be node? no, not if it had a single, finished child of its own...
				this.finish("1.finished");
			} else {
				// console.warn("1.unfinished");
			}
		} else if (this.children[1]){
			if (!this.root.nextNode){
				this.root.setNextNode(this.children[1]);
			}
		}
	},

	// this is important, so we know which child finished, and can advance to next child
	notify: function(child){
		// only applicable to 2nd+ run, after we've scanned all children
		if (this.runCount > 1){
			if (this.children[child.index + 1]){
				if (!this.root.nextNode)
					this.root.setNextNode(this.children[child.index + 1]);
			} else {
				this.finish("notified");
			}
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

		if (!this.init_route())
			return false;
		this.setNode(this);
		this.exec();
		this.done();
	},
	init_url: function(){
		this.hash = hash(this.name);
		var filePath = router.activeRoute.pathname;
		this.url = filePath + this.hash + "/";
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

var expect = exports.expect = function(a){
	return {
		toBe: function(b){
			console.assert(a === b, a, "===", b);
		},
		not: {
			toBe: function(b){
				console.assert(a !== b, a, "!==", b);
			}
		}
	}
};

var test = exports.test = function(){
	return current.addBlock.apply(current, arguments);
};