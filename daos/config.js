const dotenv = require('dotenv');
const path = require('path');

dotenv.config();


const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 8081;
const HOST = process.env.HOST || 'localhost';
const MONGO_URL = process.env.MONGO_URL ;
const SECRET = process.env.SECRET || 'secreto';
const MAIL = process.env.MAIL;

module.exports = { NODE_ENV, PORT, HOST, MONGO_URL, SECRET, MAIL };
