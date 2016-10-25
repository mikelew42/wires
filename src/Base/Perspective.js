var is = require("../is");
var Base = require("./Base");
var $ = require("jquery");
require("./styles.less");
var Logged = require("./Logged");

var Perspective = Logged.extend({
	name: "Perspective",
	init: function(){
		this.render();
	},
	render: function(){
		this.$wrapper = $("<div></div>").addClass("box-wrapper").appendTo("body");
		this.$box = $("<div><h1>Hello world</h1></div>").addClass("box").appendTo(this.$wrapper)

		this.$box.append("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac odio quis libero rhoncus egestas. Nam nec lectus leo. Ut ac malesuada felis. Suspendisse faucibus interdum lorem, non varius sapien bibendum non. Ut lacinia porttitor magna ac dictum. Integer ut lacus sed diam tempus condimentum iaculis sagittis velit. Nulla aliquet tincidunt tellus, ac scelerisque nunc aliquam vulputate. Vivamus nec nunc vel est facilisis efficitur. Maecenas pretium a massa quis placerat. Nam egestas vehicula felis sed tincidunt. Pellentesque tempor dapibus aliquet. Pellentesque ligula ipsum, mollis quis tempus in, pellentesque et nulla. Praesent mollis diam id mi viverra tempus. Morbi quis mauris at lectus iaculis lobortis id ut arcu. Pellentesque rutrum dictum dolor, nec luctus arcu dignissim eu. Quisque tincidunt, purus dapibus ornare volutpat, massa augue lobortis urna, sed fermentum ligula ligula sed libero.</p>");
		this.$box.append("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac odio quis libero rhoncus egestas. Nam nec lectus leo. Ut ac malesuada felis. Suspendisse faucibus interdum lorem, non varius sapien bibendum non. Ut lacinia porttitor magna ac dictum. Integer ut lacus sed diam tempus condimentum iaculis sagittis velit. Nulla aliquet tincidunt tellus, ac scelerisque nunc aliquam vulputate. Vivamus nec nunc vel est facilisis efficitur. Maecenas pretium a massa quis placerat. Nam egestas vehicula felis sed tincidunt. Pellentesque tempor dapibus aliquet. Pellentesque ligula ipsum, mollis quis tempus in, pellentesque et nulla. Praesent mollis diam id mi viverra tempus. Morbi quis mauris at lectus iaculis lobortis id ut arcu. Pellentesque rutrum dictum dolor, nec luctus arcu dignissim eu. Quisque tincidunt, purus dapibus ornare volutpat, massa augue lobortis urna, sed fermentum ligula ligula sed libero.</p>");
		this.$box.append("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac odio quis libero rhoncus egestas. Nam nec lectus leo. Ut ac malesuada felis. Suspendisse faucibus interdum lorem, non varius sapien bibendum non. Ut lacinia porttitor magna ac dictum. Integer ut lacus sed diam tempus condimentum iaculis sagittis velit. Nulla aliquet tincidunt tellus, ac scelerisque nunc aliquam vulputate. Vivamus nec nunc vel est facilisis efficitur. Maecenas pretium a massa quis placerat. Nam egestas vehicula felis sed tincidunt. Pellentesque tempor dapibus aliquet. Pellentesque ligula ipsum, mollis quis tempus in, pellentesque et nulla. Praesent mollis diam id mi viverra tempus. Morbi quis mauris at lectus iaculis lobortis id ut arcu. Pellentesque rutrum dictum dolor, nec luctus arcu dignissim eu. Quisque tincidunt, purus dapibus ornare volutpat, massa augue lobortis urna, sed fermentum ligula ligula sed libero.</p>");
		this.$box.append("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac odio quis libero rhoncus egestas. Nam nec lectus leo. Ut ac malesuada felis. Suspendisse faucibus interdum lorem, non varius sapien bibendum non. Ut lacinia porttitor magna ac dictum. Integer ut lacus sed diam tempus condimentum iaculis sagittis velit. Nulla aliquet tincidunt tellus, ac scelerisque nunc aliquam vulputate. Vivamus nec nunc vel est facilisis efficitur. Maecenas pretium a massa quis placerat. Nam egestas vehicula felis sed tincidunt. Pellentesque tempor dapibus aliquet. Pellentesque ligula ipsum, mollis quis tempus in, pellentesque et nulla. Praesent mollis diam id mi viverra tempus. Morbi quis mauris at lectus iaculis lobortis id ut arcu. Pellentesque rutrum dictum dolor, nec luctus arcu dignissim eu. Quisque tincidunt, purus dapibus ornare volutpat, massa augue lobortis urna, sed fermentum ligula ligula sed libero.</p>");


		var self = this;
		$(document).on("mousemove", function(e){
			// console.log(e);
			// console.log("client", e.clientX, e.clientY);
			var $window = $(window),
				win = {
					x: $window.width(),
					y: $window.height()
			};

			win.midX = win.x / 2;
			win.midY = win.y / 2;
			win.mid = [win.midX, win.midY];

				var xAmount = (win.midX - e.clientX) / win.midX;
				var left = xAmount * 2;
				// left += 25;


				var yAmount = (win.midY - e.clientY) / win.midY;
				var top = yAmount * 2;
				// top += 25;

				// console.log("z? ", Math.sqrt(Math.pow(left, 2), Math.pow(top, 2)));
				// var translateZ = " translateZ( -" + Math.sqrt(Math.pow(left, 2), Math.pow(top, 2)) + "% )";
				// console.log(translateZ);
				self.$box.css({
					// top: top + "%",
					// left: left + "%", 
					transform: "rotateX( " + yAmount * -3 + "deg ) rotateY(" + xAmount * 3 +"deg ) translateX(" + left + "% ) translateY(" + top+"% )"
				});

		});
	}
});

$(function(){
	var p = new Perspective();
});