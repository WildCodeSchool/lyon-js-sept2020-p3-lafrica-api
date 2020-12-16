const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = require("./env");

const sessionStore = new MySQLStore({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  multipleStatements: true,
  namedPlaceholders: true,
});
module.exports = sessionStore;
