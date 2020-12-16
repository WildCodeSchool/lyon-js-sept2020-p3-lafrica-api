const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./db');

const sessionStore = new MySQLStore(db.connectionOptions);
module.exports = sessionStore;
