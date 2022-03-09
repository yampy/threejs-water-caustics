const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'main.js',
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        open: true
    },
    module : {
        rules : [
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.(vert|frag|glsl)$/,
                use: {
                    loader: 'webpack-glsl-loader'
                }
            }
        ],
    }
}