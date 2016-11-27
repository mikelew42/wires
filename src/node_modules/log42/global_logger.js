var get_logger = require("./logger");

var enabled_logger = get_logger.enabled_logger;
var disabled_logger = get_logger.disabled_logger;

var get_global_logger = function(value){
	if (global_state_chain.length){
		return get_logger(global_state_chain[global_state_chain.length - 1]);
	} else {
		return get_logger(value);
	}
};

// enabled_logger.get = get_global_logger;
// disabled_logger.get = get_global_logger;

get_global_logger.install = function(mod, starting_value){
	// if (mod.id === 4)
	// 	debugger;
	var current_logger = get_global_logger(starting_value);
	Object.defineProperty(mod, "log", {
		configurable: true,
		get: function(){
			return current_logger;
		},
		set: function(value){
			if (value === true)
				debugger;
			if (this.hasOwnProperty("log"))
				current_logger = get_logger(value);
			else
				get_global_logger.install(this, value);
		}
	});
	register_mod(mod, starting_value);
};

var registered_mods = [];

var register_mod = function(mod, starting_value){
	registered_mods.push({
		mod: mod,
		starting_value: starting_value
	});
};

var global_state_chain = [];

get_global_logger.all = function(value){
	global_state_chain.push(value);
	registered_mods.forEach(function(v){
		v.mod.log = value;
	});
};

get_global_logger.all.on = function(){
	get_global_logger.all(true);
};

get_global_logger.all.off = function(){
	get_global_logger.all(false);
};

get_global_logger.all.current = function(){
	return global_state_chain[global_state_chain.length - 1];
};

get_global_logger.all.restore = function(){
	var last;
	if (global_state_chain.length){
		global_state_chain.pop();
		if (global_state_chain.length){
			last = global_state_chain[global_state_chain.length - 1];
			registered_mods.forEach(function(v){
				v.mod.log = last;
			});
		} else {
			registered_mods.forEach(function(v){
				// console.log(v.mod.name, v.mod.id, v.mod);
				v.mod.log = v.starting_value;
			});
		}
	} else {
		console.warn("out of sync");
	}
};

enabled_logger.all = get_global_logger.all;
disabled_logger.all = get_global_logger.all;

module.exports = get_global_logger;