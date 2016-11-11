Module.extend({
	someQ: function(){}, // override
	someQ: [function(){}], // anon queue
	someQ: {
		named: function(){}, // create and auto Q new named fn
		existing: function(){}, // override existing fn
		appendToExisting: [function(){}], // could auto upgrade if not yet a Q - append anonymous to the Q
		appendNamedToExisting: { // upgrade to Q
			sub: function(){} // auto q named sub
		},
		configExisting: {
			config: {
				init: function(){}
			}
		},
		a: {
			whole: {
				tree: {
					of: {
						sub: function(){},
						could: function(){}
					},
					be: {
						created: function(){}
					}
				}
			}
		} // this seems goofy, but it allows you to insert/q a fn at any point in the tree...
	},
	someQ: {
		config: {
			named: function(){} // simply add as a sub property
		}
	}
})