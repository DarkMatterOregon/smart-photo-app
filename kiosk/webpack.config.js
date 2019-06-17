const path = require('path');

module.exports = {
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'kiosk.bundle.js',
        publicPath: '/'
    },
    resolve: {
        symlinks: false,
        alias: {
            Shared: path.resolve(__dirname, '../shared/')
        }
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            '@babel/preset-react',
                            '@babel/preset-env'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-syntax-dynamic-import',
                            [ 'babel-plugin-webpack-alias', { config: './webpack.config.js' } ]
                        ]
                    }
                }
            },

            {
                test: /\.(png|jpg|woff|woff2|eot|ttf|gif|svg)(\?[a-z0-9=.]+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1
                        }
                    }
                ]
            },

            {
                test: /\.(pdf|zip)$/,
                loader: 'file-loader?name=[name].[ext]'
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    devServer: {
        hot: true,
        historyApiFallback: true,
        disableHostCheck: true,
        contentBase: './www'
    }
};
