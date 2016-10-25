module.exports = require("./Base1");


// If I do something like that, maybe should just be a single number, for now:
// Base1.v23.js
// require("../Base1").v23

// One advantage to a single property for all versions, is that you could add it to the default Class
// 		require("../Base1") --> index.js --> Base1.js
// and  require("../Base1").v23  // this means we have .v2, .v3, .v4, etc...
// vs   require("../Base1").v[23] // v could be an object here, or array, no matter
		// this way, all the versions are attached to the default class, but contained on one property


// how about a require.context with all Base1.v{-\d-\d-\d...}.js --> arrays of versions, so you could require like this:

// require("../Base1").v[x][y][z];
// or
// require("../Base1/Base1.vX-Y-Z.js");