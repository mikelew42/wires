var Base = require("../Base");

var Method = module.exports = Base.extend({
	init: function(){
		this.argNames = getParamNames(this.method);
	},
	wrapper: function(){
		var _log = this.log,
			argNames = this.argNames,
			methodLogger = this;
			wrapped = function(){
				var ret,
					log = this.log || _log; // in case a wrapped method is called with a context that doesn't have its own logger...
				if (!log.shouldLog(this))
					return fn.apply(this, arguments);
				if (log.expand)
					log.method(this, name, arguments, argNames);
				else
					log.methodc(this, name, arguments, argNames);

				ret = fn.apply(this, arguments);
				log.ret(ret);
				return ret;
			};

		wrapped.wrapped = true;
		return wrapped;
	}
});