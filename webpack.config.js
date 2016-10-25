var globule = require('globule');
var path = require("path");
// var MyPlugin = require("./MyPlugin");


var entry = {
  // "./public/main": './src/entry.js'
};

var files = globule.find("./src/**/*.entry.js").forEach(function(filePath){
  var entryName = filePath.replace(path.extname(filePath), "");
  entryName = entryName.replace(".entry", "").replace("./src", "");
  console.log(entryName);
  entry[entryName] = filePath;
});

module.exports = {
  devtool: 'inline-source-map',
  entry: entry,
  output: {
    path: './build/',
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
  // ,plugins: [
  //   new MyPlugin({options: 'nada'})
  // ]
  // ,
  // devServer: {
    // historyApiFallback: true
  // }
};
