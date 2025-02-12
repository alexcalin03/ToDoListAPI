const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:
    {
        main: './src/index.js', // Entry file for the app
        login: './src/login.js', // Entry file for the login page
        register: './src/register.js', // Entry file for the register page
        account: './src/account.js', // Entry file for the account page
    },
    output: {
        filename: '[name].bundle.js', // Output file name
        path: path.resolve(__dirname, 'dist'), // Output directory
        clean: true, // Clean the output directory before each build
    },
    mode: 'development', // Set mode to development or production
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'), // Directory to serve files from
        },
        port: 8080, // Port for the dev server
        open: true, // Automatically open the browser
        hot: true,  // Enable Hot Module Replacement
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Path to your template file
            chunks: ['main'], // Specify the chunks to include
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: './src/login.html',
            chunks: ['login'], // Specify the chunks to include
        }),
        new HtmlWebpackPlugin({
            filename: 'register.html',
            template: './src/register.html',
            chunks: ['register'], // Specify the chunks to include
        }),
        new HtmlWebpackPlugin({
            filename: 'account.html',
            template: './src/account.html',
            chunks: ['account'], // Specify the chunks to include
        }),
        
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], // Handle CSS
            },
        ],
    },

};
