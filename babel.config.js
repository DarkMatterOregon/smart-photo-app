let babelOptions = {
    presets: ['module:metro-react-native-babel-preset']
};

if (process.env.BUILD_TYPE === 'web') {
    console.log('babel.config.js loaded because Ima dumb dumb ... type is web so ignoring');
    babelOptions = {};
}

module.exports = babelOptions;
