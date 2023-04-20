const path = require('path')

module.exports = {
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
        ],
    },
    performance: {
        maxAssetSize: 500,
        maxEntrypointSize: 1000,
        hints: 'warning'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        stats: {
            assets: true,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            publicPath: false,
            timings: true,
            version: true,
            warnings: false,
            colors: {
                green: '\u001b[32m',
            }
        }
    },
}
