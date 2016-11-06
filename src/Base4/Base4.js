var Base2 = require("../Base/Base2");
var create = require("./create");
var Set = require("./Set");
var Extend = require("../ExtendModFn/ExtendModFn2");
var events = require("events");
var track = require("../track/track");
var createConstructor = require("./createConstructor");
var isExtensionOf = require("../Base/isExtensionOf");
var inst = require("./inst");
var setup = require("./setup");

var Base3 = createConstructor("Base3");
track(Base3);
track(Base3.prototype);


// when might this auto instantiation of Sub classes be undesireable?
// can we always easily turn it off?  not if its a reference...

Base3.assign({
	Extend: Extend,
	extend: new Extend().fn, // this could be autoInstantiated?
	isExtensionOf: isExtensionOf,
	setup: setup
}, events.prototype); // .on, .emit, etc. .extend will clobber the ._events

Base3.prototype.assign({
	create: create,
	inst: inst,
	set: new Set().fn, // not a true Sub module (not autoInstantiated per instance)
	init: function(){}
});

module.exports = Base3;

/*
Do we want to use .set on extend?
- Recursively set?
- Set as a ModFn allows great extensibility...
- Matches the new ({})--> .set pattern

Should be as close to assign as possible... and maybe split from a more advanced .set, in case it deviates:
- override fns with fns

Currently, set doesn't do much other than assign:
- it calls .set on props, if present
- it calls fns with arrays or non-fn values
- it allows easy override, if you need to upgrade
- it provides override points for set("str", 123, etc)

*/