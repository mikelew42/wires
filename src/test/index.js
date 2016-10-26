var Route = require("../core/Route");
var router = require("../router");

router.addRoutes(new Route({
	pathname: "/test/",
	label: "/test/",
	allowDefault: true
}));
/*
Instead of doing dynamic path matching, I could just add all routes...
*/

// var TestRoute = Route.extend({});

// var requireAll2 = function(context) {
// 	var keys = context.keys(), key;
// 	console.log(keys);
// 	for (var i = 0; i < keys.length; i++){
// 		console.group(keys[i]);
// 		key = keys[i];
// 		key = key.replace("./", "").replace(".tests.js", "");
// 		var paths = key.split("/"), path;
// 		for (var j = 0; j < paths.length; j++){
// 			path = paths[j];
// 			var pathname = path;
// 			for (var k = 0; k < j; k++){
// 				pathname = paths[k] + "/" + pathname;
// 			}
// 			console.log(pathname);
// 			router.addRoutes(new Route({
// 				pathname: "test/" + pathname,
// 				label: pathname,
// 				key: keys[i],
// 				allowDefault: true,
// 				matchBeginning: true
// 			}).then(function(){
// 				// console.clear();
// 				context(this.key);
// 			}));
// 		}
// 		// context(keys[i]);
// 		console.groupEnd();
// 	}
// 	// keys.forEach(context); 
// };

var requireAll = function(context) {
	var keys = context.keys(), key;
	for (var i = 0; i < keys.length; i++){
		key = keys[i].replace("./", "").replace(".tests.js", "");

		router.addRoutes(new Route({
			pathname: "test/" + key,
			label: key,
			key: keys[i],
			allowDefault: true,
			matchBeginning: true
		}).then(function(){
			// console.clear();
			context(this.key);
		}));
	}
	// keys.forEach(context); 
};
requireAll(require.context('../', true, /\.tests\.js$/));




/*
We need to create routes for all these tests.

Basically...

/test/  -->  run all tests, and navigate to each subset to run in isolation
/path/test/
vs 
/test/path/ ?? honestly, both of them are equally logical

/path/sub/test
or /test/path/sub/

And then the hashes for the sub-path test groups

1)  There could be several .tests.js files inside a path, and logically, all of them should run
2)  So, each file should get its own UI for isolating that file

Are you allowed to have dots in the path?

/test/path/something.tests.js/

No need, just drop the tests.js:

/test/path/ --> run all .tests.js files in this folder
/test/path/name --> leave off trailing slash to indicate its not a folder?
	that might make things more complicated, with using absolute vs relative links and stuff..

Also, if we use a file name in path, we need the / to add sub tests

/test/path/file/hash/hash/hash...

How does the router handle this?

1) Our on page load handler needs to parse the current url, and match it to available routes
2) We need to generate the path structure beforehand, such as here, in this file


Find all .tests.js files.
Break down the path into an absolute path array: ["root", "next"]
Then store the file name as the next path part:
	.path: ["root", "path"]
	.file: "file" //.tests.js

Default to run the last path part, .tests.js:

	/root/path/path.tests.js --> /root/path/path/ ?
		no, just drop the redundant path part:
			/root/path/ --> runs path.tests.js

	Then, if you have 2+ files, use "all"
	/root/path/all/
		--> runs path.tests.js and whatever else is there

	Then, if you want to isolate the default file, drop the /all/ ?  or add a redundant /path/ ?

	Or, we just forget the file part, and assume there's only one tests file per folder?




Uh oh.  So, we don't know the test hashes until we run the whole set...

1) Look at URL
2) Folder/path parts can be determined pre-tests.js file
3) File path part can be determined pre-tests.js file
4) But, we don't know any hashes until we actually run the tests

So, the path/file will determine which .tests.js file to run, and it will be run.  The /hash/ parts (or whatever is left after the path and file have matched), are passed to the test runner, so that these hashes can be checked while the test is in progress:

If there's no hash, just run all of them.
If there is a hash, the first one is the RootBlock hash.
If the hash matches, run that root block.  If not, skip it.
If there is another hash, that must be the next level block.

Continue this matching until you find the group/node.

If we run the entire RootBlock, matching the hashes each time, it should function properly, looping through, skipping non-matches, and hopefully executing all children within the match.


*/