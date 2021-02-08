const argon2 = require('argon2');
const crypto = require('crypto');
const db = require('../db');
const { ValidationError, RecordNotFoundError } = require('../error-types');
const { user } = require('../db').prisma;

const findOne = async (id, failIfNotFound = true) => {
  const result = await db.query('SELECT * FROM user WHERE id = ?', [id]);
  if (result.length) {
    return result[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError();
  return null;
};

// Check if email already exist in DB

const emailAlreadyExists = async (email) => {
  const lowerCaseEmail = email.toLowerCase();
  const rows = await db.query('SELECT * FROM user WHERE email = ?', [
    lowerCaseEmail,
  ]);
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
  const lowerCaseEmail = email.toLowerCase();
  const encrypted_password = await hashPassword(password);
  const res = await db.query(
    'INSERT INTO user (firstname, lastname, email, encrypted_password, phone_number) VALUES (?, ?, ?, ?, ?)',
    [firstname, lastname, lowerCaseEmail, encrypted_password, phone_number]
  );
  return { firstname, lastname, lowerCaseEmail, id: res.insertId };
};

const findByEmail = async (email, failIfNotFound = true) => {
  const lowerCaseEmail = email.toLowerCase();
  const rows = await db.query(`SELECT * FROM user WHERE email = ?`, [
    lowerCaseEmail,
  ]);
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError();
  return null;
};

const verifyPassword = async (encrypted_password, password) => {
  return argon2.verify(encrypted_password, password);
};

const forgotPassword = async (user_id) => {
  const token = crypto.randomBytes(64).toString('hex');

  console.log(token);

  const date = Date.now() + 3600000; // 1 hour
  const tokenExpires = new Date(date); // formated for SQL

  const tokenCreated = await db.query(
    'UPDATE user SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
    [token, tokenExpires, user_id]
  );

  if (tokenCreated) {
    return token;
  }
  return false;
};

const checkUserToken = async (token) => {
  const date = Date.now();
  const formated_date = new Date(date);
  const userWithToken = await db.query(
    'SELECT * FROM user WHERE resetPasswordToken = ? and resetPasswordExpires > ?',
    [token, formated_date]
  );
  if (userWithToken.length) {
    return userWithToken[0];
  }
  return false;
};

const resetPassword = async (password, user_id) => {
  const encrypted_password = await hashPassword(password);
  try {
    await db.query('UPDATE user SET encrypted_password = ? WHERE id = ?', [
      encrypted_password,
      user_id,
    ]);
    return true;
  } catch (err) {
    return false;
  }
};

const validateUser = async (id) => {
  await db.query('UPDATE user SET user_confirmed = ? where id = ?', [true, id]);

  const result = await findOne(id, false);

  if (result) {
    delete result.encrypted_password;
    delete result.resetPasswordToken;
    delete result.resetPasswordExpires;
    delete result.manager_id;
    delete result.role;
    return result;
  }
  return false;
};

const getCollection = async (
  limit,
  offset,
  orderBy,
  firstname,
  lastname,
  email
) => {
  // const campaigns = await db.query(
  //   'SELECT * FROM mailing_campaign WHERE id_client_user = ?',
  //   [id]
  // );
  const users = await user.findMany({
    where: {
      firstname: {
        contains: firstname || undefined,
      },
      lastname: {
        contains: lastname || undefined,
      },
      email: {
        contains: email || undefined,
      },
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      user_confirmed: true,
      phone_number: true,
    },
    orderBy,
    take: limit,
    skip: offset,
  });

  const total = (
    await user.aggregate({
      where: {
        firstname: {
          contains: firstname || undefined,
        },
        lastname: {
          contains: lastname || undefined,
        },
        email: {
          contains: email || undefined,
        },
      },
      count: true,
    })
  ).count;
  return [total, users];
};
module.exports = {
  findByEmail,
  validate,
  createUserInDatabase,
  emailAlreadyExists,
  findOne,
  hashPassword,
  verifyPassword,
  forgotPassword,
  resetPassword,
  checkUserToken,
  validateUser,
  getCollection,
};
