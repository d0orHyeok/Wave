const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: 'production',
      'process.env.name': JSON.stringify('Flujo'),
    }),
    new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin(),
  ],
}
