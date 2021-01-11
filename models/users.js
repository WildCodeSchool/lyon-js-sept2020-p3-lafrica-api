const argon2 = require('argon2');
const db = require('../db');
const { ValidationError, RecordNotFoundError } = require('../error-types');

const findOne = async (id, failIfNotFound = true) => {
  const user = await db.query('SELECT * FROM user WHERE id = ?', [id]);
  if (user.length) {
    return user[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError();
  return null;
};

// Check if email already exist in DB

const emailAlreadyExists = async (email) => {
  const rows = await db.query('SELECT * FROM user WHERE email = ?', [email]);
  if (rows.length) {
    return true;
  }
  return false;
};

// check if data sent by form are OK (Validation then try with emailAlreadyExist)

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

// Argon2 hashing password

const hashPassword = async (password) => {
  return argon2.hash(password);
};

// New user created in DB, data in db except password, keeping hashing one,  then return some informations to the front

const createUserInDatabase = async (newAttributes) => {
  await validate(newAttributes);
  const { firstname, lastname, email, password, phone_number } = newAttributes;
  const encrypted_password = await hashPassword(password);
  const res = await db.query(
    'INSERT INTO user (firstname, lastname, email, encrypted_password, phone_number) VALUES (?, ?, ?, ?, ?)',
    [firstname, lastname, email, encrypted_password, phone_number]
  );
  return { firstname, lastname, email, id: res.insertId };
};

const findByEmail = async (email, failIfNotFound = true) => {
  const rows = await db.query(`SELECT * FROM user WHERE email = ?`, [email]);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError();
  return null;
};

const verifyPassword = async (encrypted_password, password) => {
  return argon2.verify(encrypted_password, password);
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
