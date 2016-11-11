// No need for a file-level logger... just wrap stuff in methods, way cleaner
// Copy the logger on .extend, so we can protect underlying classes, and configure this.log however we want

Logged.log === Logged.prototype.log;

MyModule = Logged.extend({
	autoLoggedMethod: function(){
		this.log.whatever();
	}
});

MyModule.log === MyModule.prototype.log;
MyModule.log !== Logged.log; // protect base classes
MyModule.log // is copied from Logged.log, so config is passed down?  Sure.

MyModule.assign({
	someFunction: function(){
		// auto wrapped
		// put random bits of functionality onto the Constructor, so they can be auto wrapped, and contextualized properly
		// this also makes it easier to access them later, even override them, etc
	}
});

MyModule.someFunction(); // auto logged

// CONCLUSION:  No need for a file-level logger, and all that log = this.log || _log bullshit.






var logger;

var MyModule = Module.extend({
	autoLoggedMethod: function(){
		var log = this.logger || logger;
	}
});

// link up the Class.prototype.logger with the file's logger, so you can turn them both on/off in one step...
logger = MyModule.prototype.logger; // ?
logger.start().stop().config();

// well, if ALL logged modules will have a reference somewhere on their prototype chain to a logger, then we could just go back to this.log, and not even have to bind to it...

var log;

var MyModule = Logged.extend({
	autoLoggedMethod: function(){
		// use this.log here, to be runtime-dynamic
		// no need to bind, this.log is pretty short
		this.log.debug("whatever");
	}
});

log = MyModule.prototype.log;  // is that safe?  MyModule.prototype.log is actually on the Logged.prototype, and modifying it modifies the settings for all Logged instances...
log.start().stop().config();

Logged.Logger; // reference to the Logger that created Logged.prototype.log
// only one .log is needed on the prototype to be functional, and all extensions can utilize it.. but then you'd have to be sure to customize it



// if i want to override it..

var Logger = Logged.Logger.extend({
	// ... customize it
});

var logger = Logger();

var MyModule = Logged.extend({
	autoLoggedMethod: function(){
		this.log.whatever();
	},
	logger: logger // prototype instance to be shared
}).assign({
	Logger: Logger // mainly for reference/easy access when extending MyModule
});

/*
Does this satisfy the requirement to have a single logger for the file?
- If you want to log stuff within the file that's not an instance method, maybe it can be put into a "static" Constructor method, and auto logged anyway.
--> there really shouldn't be any code that runs (and needs to be logged) directly in the module file...
--> i suppose there could be, though...
--> when I get around to wrapping the webpack module functions, then maybe they can be called with context, so "this.log" works, per usual
--> but, there could be possibility for a standalone "var = log";


Do we need a file-level logger?  In the example above, we're creating/overriding the new prototype's .logger property, and using that doubly in the file, and on the prototype.

The thing is, inside methods, you'll always have access to "this.log".  In fact, we could keep a logger instance on the Constructors as well, so Constructor.method() can use "this.log".

That way, we don't actually need to keep a copy at the root file level.  Everything should be in functions.

But what about... a CB.
Let's say you require("module-instance"), and just want to add a CB
But, you want it wrapped.
mod.on("event", wrap(function(){}).bind(this));

You could bind the function, then wrap it... because then when the function is ultimately called, it will be called with teh correct context.  Either way should work.

But anyway, if you're adding a CB from an empty module/file, you don't have an instance, really... Well, if the module runs with a particular ctx, you can use that ctx's logger.  

If you rebind the cb to another module, then you could use that logger.  Either way, it should have a context, and can use that context's log.

I don't see why you couldn't have a file-level logger.  Its just not particularly necessary.  Especially if you want to be able to turn logging on/off for an entire class.

By the way - if loggers are shared (which is part of the plan right now?), then you can't just call this.log.on/off() or Class.prototype.log.on/off()

Because its a shared logger, and that would affect all the underlying classes.

Maybe we follow the reinstantiate on .extend principle, so that every new class gets its own logger...

Maybe teh Constructor.log === Constructor.prototype.log.  That makes an easy way to configure it...  Either "this.log.whatever()" or Class.log.whatever();





Also, what about binding?  Can we still do a mod.wrappedMethod.bind(mod)?  Sure, I don't see why not..




The next question about the Logger, is how to configure it.



But, if we have the file's logger equal the Class.prototype.logger, then we have a nice harmony to turn everything on/off - both wrapped methods and the in-place methods.

So, if every 

Can the prototype.logger be shared down the line?  For example, ClassB.prototype doesn't have own logger, but falls back to ClassA.prototype.logger...

The question is, do we ever edit the logger directly?
If we wanted to modify the logger, we'd want to extend it...

For example,

ClassB = ClassA.extend({
	logger: ClassA.Logger.extend({})
});

And what about extending the logger just to modify the Logger.Method subclass?

var ClassBLogger = ClassA.Logger.extend({
	
})

ClassB = ClassA.extend({
	logger: ClassA.Logger.extend({}).assign({
		Method: ClassA.Logger.Method.extend({
	
		})
	}) // !! must return "this"
});


This pattern:

Class.SubClass // Nest the constructors on each other

Then, at some point you construct an instance from the constructor.
- this can be either once on a base prototype (and shared on extensions)
- per class (a new instance is put on the new prototype when the class is extended)
- per instance (a new instance (of the sub class) is put on the parent class instance)

And, you could have a similar Class.SubClass and instance.SubClass fallback:
1) It's easier to access sub classes directly on the Constructor, such as in the example above
2) For modules that don't need to customize a sub module per instance, there's not really an advantage to putting it on the prototype...
 - As long as you copy the SubClass to the ExtClass when extending the ParentClass

3) In some cases, however, it would make sense to be able to add the SubClass to the instance itself, in order to customize it per instance.

But, this is all a delicate race to make sure everythign happens in the right order.


*/