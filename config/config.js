const path = require('path');
module.exports = {
    development: {
        port: 3000,
        dbPath: 'mongodb://localhost:27017/messenger-db',
        rootPath: path.normalize(
            path.join(__dirname, '../../'))
    },
    production: {
        port: process.env.PORT,
        dbPath: process.env.MONGOLAB_URI
    }
};