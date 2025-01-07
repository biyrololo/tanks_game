const path = require('path');

module.exports = {
    mode: 'production', // или 'development'
    entry: './index.js', // ваш основной файл
    output: {
        filename: 'bundle.js', // название выходного бандла
        path: path.resolve(__dirname, 'dist'), // папка для выходных файлов
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // чтобы использовать ES6 и другие возможности JS
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
