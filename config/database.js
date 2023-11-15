const mongoose = require('mongoose');
require('dotenv').config();
const connStr = process.env.MONGODB_URI;

mongoose.connect(connStr);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

module.exports = db;
