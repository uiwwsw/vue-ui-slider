const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'vue-ui-slider.min.js'
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: false
    })
  ]
});
