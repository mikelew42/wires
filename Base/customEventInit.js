var copyEvents = function(eventsObj){
	var copy = Object.create(eventsObj);
	// aww, we can't do that - because the events object uses arrays.  if the prototype _events uses the same event name, adds an array, and then the ext _events obj looks up that same prop name, it will end up adding a CB to the underlying array, instead of its own...

	// You'd have to re-engineer this thing in order to check "has own" before modifying the cbs

	// let's just clobber it for now

	// or, a much simpler solution than trying to make this prototype linkage work:  just make a full copy...  this would be good for an init module?
};

var customEventInit = module.exports = function(){
	this._events = this._events ? copyEvents(this._events) : {};
};