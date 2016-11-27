var console_methods = ["log", "group", "debug", "trace", "error", "warn", "info"];

var enabled_logger = console.log.bind(console);
enabled_logger.enabled = true;
enabled_logger.disabled = false;

console_methods.forEach(function(name){
	enabled_logger[name] = console[name].bind(console);
});

enabled_logger.groupc = console.groupCollapsed.bind(console);
enabled_logger.end = console.groupEnd.bind(console);

var noop = function(){};
var disabled_logger = function(){};
disabled_logger.disabled = true;
disabled_logger.enabled = false;
console_methods.forEach(function(name){
	disabled_logger[name] = noop;
});
disabled_logger.groupc = noop;
disabled_logger.end = noop;

var get_logger = function(value){
	if (typeof value === "undefined")
		return enabled_logger;
	else if (typeof value === "boolean")
		return value ? enabled_logger : disabled_logger;
	else if (typeof value === "function")
		return value;
};

get_logger.enabled_logger = enabled_logger;
get_logger.disabled_logger = disabled_logger;

// enabled_logger.get = get_logger;
// disabled_logger.get = get_logger;

get_logger.install = function(mod, starting_value){
	var current_logger = get_logger(starting_value);
	Object.defineProperty(mod, "log", {
		configurable: true,
		get: function(){
			return current_logger;
		},
		set: function(value){
			if (this.hasOwnProperty("log"))
				current_logger = get_logger(value);
			else
				get_logger.install(this, value);
		}
	});
};

module.exports = get_logger;