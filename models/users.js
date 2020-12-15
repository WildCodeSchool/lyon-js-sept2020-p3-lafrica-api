const argon2 = require('argon2');
const db = require('../db');
const { ValidationError } = require('../error-types');

/* model emailALreadyExists
model Validate 
mode hashPassword
model createUserInDatabase
model verifyPassword */

// Vérification si l'email exsiste déja dans la DB

const emailAlreadyExists = async (email) => {
  const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length) {
    return true;
  }
  return false;
};

// Vérification si les infos provenant du formulaire sont OK (présence des infos puis passagage de ces infos dans emailAlreadyExist)

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

// Utilisation de Argon2 pour "hasher" le password

const hashPassword = async (password) => {
  argon2.hash(password);
};

// Création de l'utilisateur dans la base de données, ou l'on va stocker ces infos sauf son password perso, on stock la version hashée et on retourne quelques infos pour s'en servir sur le front

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
  //   findByEmail,
  validate,
  createUserInDatabase,
  emailAlreadyExists,
  //   findOne,
  hashPassword,
  // verifyPassword,
};
