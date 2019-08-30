const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // для очистки папки output.path перед работой

const buildWebpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    plugins: [        
        new CleanWebpackPlugin() // очистка output.path
    ]
});

module.exports = new Promise( (resolve, reject) => {
    resolve(buildWebpackConfig);
});