var Base = require("../Base");

var IPBCLE = Base.extend({
	name: "IPBCLE"
});

Object.defineProperties(IPBCLE.prototype, {
	group: {
		get: function(){
			return console.group.bind(console, "a", "b");
		}
	}
});

module.exports = IPBCLE;


console.log("console.log");
console.warn("console.warn");
console.error("console.error");
console.info("console.info1");
console.debug("console.debug");
console.group("group1");
	console.debug("console.debug");
	console.log("console.log");
	console.warn("console.warn1");
	console.error("console.error");
	console.info("console.info");
	console.group("group2");
		console.info("console.info");
		console.log("console.log");
		console.warn("console.warn1");
		console.error("console.error");
		console.group("group2-1");
			console.info("console.info");
			console.log("console.log");
			console.warn("console.warn2");
			console.warn("console.warn1");
			console.error("console.error");
		console.groupEnd();
		console.info("console.info");
		console.log("console.log");
		console.warn("console.warn");
		console.error("console.error");
		console.group("group2-2");
			console.info("console.info");
			console.log("console.log");
			console.warn("console.warn");
			console.error("console.error");
		console.groupEnd();
		console.info("console.info");
		console.log("console.log");
		console.warn("console.warn");
		console.error("console.error");
	console.groupEnd();
	console.info("console.info");
	console.log("console.log");
	console.warn("console.warn");
	console.error("console.error");
console.groupEnd();
console.log("console.log");
console.warn("console.warn");
console.error("console.error");
console.info("console.info");