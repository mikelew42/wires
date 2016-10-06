var globule = require('globule');
var path = require("path");

var entry = {
  // "./public/main": './src/entry.js'
};

var files = globule.find("./**/*.entry.js", "!./node_modules/**", "!./jasmine/**").forEach(function(filePath){
  var entryName = filePath.replace(path.extname(filePath), "");
  entryName = entryName.replace(".entry", "");
  console.log(entryName);
  entry[entryName] = filePath;
});

module.exports = {
  devtool: 'inline-source-map',
  entry: entry,
  output: {
    path: './',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style!css" },
      { test: /\.useable\.css$/, loader: "style/useable!css" },
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=20000&minetype=application/font-woff&name=/[hash].[ext]" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  }
  // ,
  // devServer: {
    // historyApiFallback: true
  // }
};
