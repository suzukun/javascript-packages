const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    target: "web",
    plugins: [
        new HtmlWebpackPlugin({
            meta: {
                viewport: "width=device-width",
            },
            minify: true,
        }),
    ],
};
