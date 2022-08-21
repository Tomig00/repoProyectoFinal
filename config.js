const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV + '.env')
});

module.exports = { 
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 8081,
    HOST: process.env.HOST || 'localhost',
    MONGO_URL: process.env.MONGO_URL,
    SECRET: process.env.SECRET,
}