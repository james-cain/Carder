const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV;
const buildingForLocal = () => NODE_ENV === 'development';
const resolve = dir => path.join(__dirname, dir);

const config = {
  entry: {
    build: resolve('/magic.js')
  },
  output: {
    path: buildingForLocal() ? path.resolve(__dirname) : resolve('dist'),
    library: 'Carder',
    libraryTarget: 'umd',
    filename: 'carder.min.js'
  },
  resolveLoader: {
    modules: [resolve('node_modules')]
  },
  mode: buildingForLocal() ? 'development' : 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin()
    ]
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_module/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }]
      }
    ]
  }
};

if (NODE_ENV !== 'development') {
  config.plugins.push(
    new CleanWebpackPlugin(['dist'], {
      root: resolve('./')
    })
  )
}

module.exports = config;
