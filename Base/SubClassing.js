/*
SubClass pecking order
- Constructor.SubClass
- Constructor.prototype.SubClass
- instance.SubClass

The following init code will follow that order.

If we sync the Constructor.Sub and Constructor.prototype.Sub, it saves some complexity

*/

var SubSub = Module.Sub.SubSub.extend({

});

var Sub = Module.Sub.extend({
	SubSub: SubSub
}).assign({
	SubSub: SubSub // keep them in sync
})

var MyModule = Module.extend({
	inst_sub: function(o){
		this.sub = this.Sub(o); 
	},
	Sub: Sub
}).assign({ // this only works if .assign() returns "this"
	// "static" methods
	Sub: Sub
});
// this may be a little extra work, but in the light of transparency...


// extending 

var Sub = MyModule.Sub.extend({

});

var MyModule2 = MyModule.extend({
	Sub: Sub
}).assign({
	Sub: Sub
});




// Then we would have

MyModule.SubClass.SubSubClass;

// and then, how do we use these SubClasses?  any instance has access to its constructor.  you could do this at construct-time, or in init: that is, choose which constructor to use

// how about shared prototype instances?

var MyModule = Module.extend({
	logger: new Module.Logger({})
});