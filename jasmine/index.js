require("./lib/jasmine-2.4.1/jasmine.css");
require("./lib/jasmine-2.4.1/jasmine.js");
require("./lib/jasmine-2.4.1/jasmine-html.js");
require("./lib/jasmine-2.4.1/boot.js");
var sourceMappedStackTrace = require("../sourcemapped-stacktrace/sourcemapped-stacktrace.js");

var doDetail = function(detail){
  var desc = detail.querySelector(".jasmine-description"),
        messages = detail.querySelector(".jasmine-messages"),
        msgs = messages.querySelectorAll(".jasmine-result-message");

    console.groupCollapsed(desc.textContent);

    for (var i = 0; i < msgs.length; i++){
      (function(msg){
        var m = msg.textContent,
            stack = msg.nextSibling.textContent;

        console.log(stack);
      })(msgs[i]);
    }

    console.groupEnd();
};

jasmine.getEnv().addReporter({
jasmineDone: function() {
  var details = document.querySelectorAll(".jasmine-spec-detail");

  for (var i = 0; i < details.length; i++){
    doDetail(details[i]);
  }

  var traces = document.querySelectorAll(".jasmine-stack-trace")
  // console.log(traces[0].textContent);
  for(var i = 0; i < traces.length; i++) {
    (function(node){
    	// console.log(node.textContent);
    	// console.log(sourceMappedStackTrace)
      sourceMappedStackTrace.mapStackTrace(node.textContent, function(stack) {
      	// console.log(stack);
      	stack = stack.join("\n") //.replace(/\((webpack:\/\/\/.*)\)/gm, "(<a href='$1'>$1</a>)");
        node.innerHTML = node.previousSibling.textContent + "\n" + stack
      })
    })(traces[i])
  }
}
})