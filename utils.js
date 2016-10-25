var utils = module.exports = {
	hashCode: function(str){
		var hash = 0, char, one, two, three, four;
		if (str.length == 0) return hash;
		for (i = 0; i < str.length; i++) {
			char = str.charCodeAt(i);
			one = hash << 5;
			two = one - hash;
			three = two + char;
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash;
		}
		return hash;
	},
	binarytoString: function(str) {
		return str.split(/\s/).map(function (val){
			return String.fromCharCode(parseInt(val, 2));
		}).join("");
	},
	numToChar: function(num){
		// any number, float, etc --> take the last 2 digits as a number 00-99
		num = parseInt( (num + "").replace(".", "").substr(-2) );

		// convert to a number 1-62
		var code = Math.floor(num * 62 / 100) || 1;

		if (code < 1 || code > 62){
			console.error("whoops");
		}

		// 1-26
		if (code <= 26){
			return String.fromCharCode(code + 64); // --> 65-90, A-Z
		
		// 27-36 ==> 48-57
		} else if (code >= 27 && code <= 36){
			return String.fromCharCode(code + 21);
		
		// 37-62 ==> 97-122
		} else if (code >= 37 && code <= 62){
			return String.fromCharCode(code + 60)
		}
	},
	stringToCrazyNumber: function(str){
		if (str.length > 2000){
			console.warn("too big");
		}
		var code = str.charCodeAt(0),
			result = str.length * str.length + str.length;

		result += Math.sqrt(code * code + code);

		for (var i = 1; i < str.length; i++){
			code = str.charCodeAt(i);
			result += Math.sqrt(code * code + code); 
		}

		return parseInt(("" + result).replace(".", "").substr(0, 16));
	},
	hash: function(str){
		var code = utils.stringToCrazyNumber(str) + "";
		return utils.numToChar(code[0] + "" + code[15]) +
			   utils.numToChar(code[1] + "" + code[14]) +
			   utils.numToChar(code[2] + "" + code[13]) +
			   utils.numToChar(code[3] + "" + code[12]) +
			   utils.numToChar(code[4] + "" + code[11]);
	}
};