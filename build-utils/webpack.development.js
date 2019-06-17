const _ = require('lodash');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');


module.exports = (env) => {
    return {
        devServer: {
            hot: true,
            historyApiFallback: true,
            disableHostCheck: true
        },

        output: {
            publicPath: '/'
        },

        module: {
            rules: [
                {
                    test: /\.(scss|css)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                }
            ]
        },
        plugins: [
            new WriteFilePlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin()
        ]
    };
};
