const path = require('path');
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
                    presets : ['@babel/preset-env', '@babel/preset-flow', '@babel/preset-react'],
                    cacheDirectory: true
                }
            }
        ]
        
    },
    target: 'web',
    mode :'development'
}