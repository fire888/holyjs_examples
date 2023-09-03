const merge = require('webpack-merge')
const appCommonConfig = require('./webpackCommon.js')
const path = require('path')

module.exports = merge.merge( appCommonConfig, {
    //mode: 'development',
    //devtool: 'inline-source-map',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'app.bundle.js'
    }
})