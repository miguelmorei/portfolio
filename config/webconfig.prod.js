const path = require('path');
const webpack = require('webpack');
const PORT = 3000;


module.exports = {
    entry : {
        app: path.join(__dirname, '../src/js/app.js')
    },
    output : {
        filename : '[name].js',
    },
    module : {
        rules : [
            {
                test : /\.js?$/,
                loader : 'babel-loader',
                exclude: /node_modules/,
                query : {
                    presets : ['@babel/preset-env', '@babel/preset-flow', '@babel/preset-react']
                }
            }
        ]
        
    },
    plugins: [new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    })],
    target: 'web',
    mode :'production'
}