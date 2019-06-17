const _ = require('lodash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
    console.log('.................PRODUCTON..................');

    const { publicPath = '/', mode = 'production' } = env;

    return {
        output: {
            chunkFilename: '[id].[name].[chunkhash].chunk.js',
            filename: '[id].[name].[chunkhash].js',
            publicPath
        },

        optimization: {
            minimize: true,
            splitChunks: {
                chunks: 'all'
            },
            usedExports: true
        },

        module: {
            rules: [
                {
                    test: /\.(scss|css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader',
                            options: {}
                        }
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[id].[name].[chunkhash].css',
                chunkFilename: '[id].[name].[chunkhash].chunk.css'
            })
        ]
    };
};
