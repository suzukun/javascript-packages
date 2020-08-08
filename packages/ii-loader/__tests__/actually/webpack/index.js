const webpack = require('webpack');
const config = require('./config');

const compiler = webpack(config);

compiler.run(error => {
    if (error) {
        return new Error(error);
    }

    return false;
});
