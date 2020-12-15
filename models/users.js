const argon2 = require('argon2');
const db = require('../db');
const { ValidationError } = require('../error-types');

/* model emailALreadyExists
model Validate 
mode hashPassword
model createUserInDatabase
model verifyPassword */

const emailAlreadyExists = async (email) => {
  const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length) {
    return true;
  }
  return false;
};

const validate = async (attributes) => {
  const {
    firstname,
    lastname,
    email,
    password,
    password_confirmation,
  } = attributes;
  if (firstname && lastname && email && password && password_confirmation) {
    if (password === password_confirmation) {
      const emailExists = await emailAlreadyExists(email);
      if (emailExists) throw new ValidationError();
      return true;
    }
  }
  throw new ValidationError();
};

const hashPassword = async (password) => {
  argon2.hash(password);
};

const createUserInDatabase = async (newAttributes) => {
  await validate(newAttributes);
  const { firstname, lastname, email, password } = newAttributes;
  const encrypted_password = await hashPassword(password);
  const res = await db.query(
    'INSERT INTO users (firstname, lastname, email, encrypted_password) VALUES (?, ?, ?, ?)',
    [firstname, lastname, email, encrypted_password]
  );
  return { firstname, lastname, email, id: res.insertId };
};

module.exports = {
  findByEmail,
  validate,
  createUserInDatabase,
  emailAlreadyExists,
  findOne,
  hashPassword,
  verifyPassword,
};
