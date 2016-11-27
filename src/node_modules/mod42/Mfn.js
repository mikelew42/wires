var Base = require("base42");
var is = require("is");
var track = require("track");
var logger = require("log42");
var log = logger();

log.groupc("Mfn.js");

var Mfn = Base.extend({
	name: "Mfn",
	init: function(){
		var self = this;

		this.fn = function(){
			var restore;
			if (this.log && this.log.override){
				restore = true;
				this.log.override();
			}

			var ret = self.main.apply(self, [this].concat([].slice.call(arguments)));
			
			if (restore)
				logger.restore();
			
			return ret;
		};

		this.fn.mfn = this;

		this.fn.set = function(o){
			return this.mfn.clone.apply(this.mfn, arguments).fn;
		};
	},
	clone: function(){
		var clone = Object.create(this);
		track(clone);
		clone.instantiate.apply(clone, arguments);
		return clone;
	},
	main: function(ctx){}
}).assign({
	make: function(o){
		return new this(o).fn;
	}
});

logger.install(Mfn.prototype);

module.exports = Mfn;

log.end();