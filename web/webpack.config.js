// inside webpack.config.js
const path = require('path')
const webpack = require('webpack')
module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.bundle.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './build',
        port: 3000,
        historyApiFallback: {
            index: 'index.html'
        }
    },
    module: {
        rules: [
            {test: /\.js$/, exclude: /node_modules/, use: 'babel-loader'}
        ]
    }
}