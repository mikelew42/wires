var Mfn = require("mod42/Mfn");
var track = require("track");
var logger = require("log42");
var log = logger();

log.groupc("ExtendMfn.js");

var ExtendMfn = module.exports = Mfn.extend({
	name: "ExtendMfn",
	main: function(Base, o){
		var Ext, args = arguments;
		// this.log.gc("extend", function(){
			Ext = Base.create_constructor(this.get_name(Base, o));
			this.setup_constructor(Ext, Base);
			this.create_prototype(Ext, Base);
			this.instantiate_prototype(Ext, Base);
			this.setup_prototype(Ext, Base, [].slice.call(args, 1));
			this.then && this.then(Ext, Base); // ORP
		// }.bind(this));
		return Ext;
	},
	get_name: function(Base, o){
		var name;
		if (o && o.name){
			name = o.name;
			delete o.name; // otherwise it will be assigned to prototype..
			return name;
		} else {
			return Base.name + "Ext";
		}
	},
	setup_constructor: function(Ext, Base){
		Ext.assign(Base);
			track(Ext);
			Ext.base = Base;
			if (Base.log){
				logger.install(Ext, Base.log.value); // t, f, or undefined for auto
			}
	},
	create_prototype: function(Ext, Base){
		Ext.prototype = Object.create(Base.prototype);
			track(Ext.prototype);
			Ext.prototype.assign({
				constructor: Ext,
				name: Ext.name[0].toLowerCase() + Ext.name.substring(1),
				base: Base.prototype,
				proto: Ext.prototype
			});
	},
	// ORP
	instantiate_prototype: function(Ext, Base){},
	setup_prototype: function(Ext, Base, args){
		Ext.prototype.set.apply(Ext.prototype, args);
	}
});

log.end();