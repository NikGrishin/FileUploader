var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    context: __dirname + "/source",

    entry: {
        main: './main.js'
    },

    output: {
        path: __dirname + "/public",
        publicPath: '/',
        filename: "[name].js"
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.(eot|woff|ttf|svg|woff2|html)$/,
                loader: "file-loader?name=[path][name].[ext]"
            },
        ]
    },

    resolve: {
        root: [path.join(__dirname, "bower_components")]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './source/index.html'
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ],

    devtool: 'source-map',

    devServer: {
        contentBase: __dirname + '/public',
        info: true,
        inline: true,
        colors: true
    }
};