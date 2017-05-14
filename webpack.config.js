var webpack = require('webpack');
var path = require('path');
module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname + "/build",//打包后的js文件存放的地方
        filename: "nighty.login.js"
    },
    module: {
        loaders: [
            {test:/\.css$/,loader:'style-loader!css-loader'},
            {test:/\.less$/,loader:'style-loader!css-loader!less-loader'},
            { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=50000&name=[path][name].[ext]'},
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    },
    plugins:[
    ],
};
