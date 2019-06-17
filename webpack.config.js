const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const loadPresets = require('./build-utils/loadPresets');

const modeConfig = (env) => require(`./build-utils/webpack.${env.mode}.js`)(env);
const packageJson = require('./package.json');

module.exports = (env = {}) => {
    const { mode = 'production', presets = [], config = 'prod' } = env;

    const normalizedEnv = {
        ...env,
        mode,
        presets,
        config
    };

    const API_CONFIG = {
        dev: {
            api: 'https://dev-next-api.fanosity.com'
        },
        prod: {
            api: 'https://api.fanosity.com'
        },
        local: {
            api: 'http://localhost:3000'
        }
    };

    const VENDORS = [
        'lodash',
        'axios',
        'history',
        'react-router-dom',
        'react',
        'react-dom',
        'prop-types'
    ];

    return webpackMerge(
        {
            entry: {
                [`${packageJson.name}.${packageJson.version}`]: ['@babel/polyfill', './web/index.js'],
                vendor: VENDORS
            },

            mode,

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
                    }
                ]
            },

            resolve: {
                symlinks: false,
                alias: {
                    Helpers: path.resolve(__dirname, 'web/helpers/'),
                    Components: path.resolve(__dirname, 'web/components/'),
                    Apps: path.resolve(__dirname, 'web/apps/'),
                    Config: path.resolve(__dirname, 'web/config/'),
                    Actions: path.resolve(__dirname, 'web/state/actions/'),
                    HOC: path.resolve(__dirname, 'web/hocs/'),
                    State: path.resolve(__dirname, 'web/state/'),
                    Shared: path.resolve(__dirname, 'shared/')
                }
            },

            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    'typeof window': JSON.stringify('object'),
                    API_CONFIG: JSON.stringify(API_CONFIG),
                    ENV: JSON.stringify(config),
                    VERSION: JSON.stringify(packageJson.version)
                }),
                new HtmlWebpackPlugin({
                    inject: true,
                    template: './web/public/index.html',
                    environment: env
                }),
                new CopyWebpackPlugin([
                        {
                            from: './web/public/img',
                            to: 'img'
                        },
                        {
                            from: './web/public/api.json',
                            to: './'
                        }
                    ],
                    { copyUnmodified: false }
                )
            ]
        },

        modeConfig(normalizedEnv),

        loadPresets(normalizedEnv)
    );
};
