Until I finalize the different recipes, it might not be a bad idea to build them incrementally.

How about:

Mod1:  most basic, probably starts with a Base, and adds something



var Base = require("base42") --> pick the most useful "base" module recipe
Base.Base1
Base.Base2
Base.Base3 ...

Maybe the exported "chosen"/default class isn't even the last one...
If you need more features, you can use one of the later verisons:

Base === Base.Base3, for example
Base.Base4, Base5, or BaseWhatever are the additional versions



Then, for Mod, we do the same thing

Mod1 = probably the default Base.extend, but it doesn't really matter...

then Mod2 = Mod1.extend



+++++++++++++

Mfn, SetMfn, and ExtendMfn are all part of the Module, and their functionality is intertwined.

Can we make sub-folders for Mod1, Mod2, etc?
And have a "set.js" that exports a SetMfn.make({}); ??
