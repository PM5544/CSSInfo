const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    contentscript: './app/scripts.babel/index.js',
    background: './app/scripts.babel/background.js',
    chromereload: './app/scripts.babel/chromereload.js'
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, './app/scripts')
  },
  // plugins: [ new webpack.optimize.CommonsChunkPlugin("contentscript.js") ],
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['app/scripts.babel', 'node_modules']
  },
  module: {
    loaders: [
    {
      test: /\.js$/,
      loaders: ['babel-loader']
    }
    ]
  }
}
