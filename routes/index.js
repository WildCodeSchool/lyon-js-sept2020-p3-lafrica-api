// const thingsRoutes = require('./things');
const campaignsRouter = require('./campaigns');
const contactsRouter = require('./contacts');
const usersRouter = require('./users');
const authRoutes = require('./auth');
const sendVocalToPhone = require('./sendVocalToPhone');

const requireCurrentUser = require('../middlewares/requireCurrentUser');

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/users', usersRouter);
  app.use('/users/:user_id/campaigns', requireCurrentUser, campaignsRouter);
  app.use('/users/:user_id/contacts', requireCurrentUser, contactsRouter);
  app.use('/auth', authRoutes);
  app.use('/voice/sendVocalMessage', sendVocalToPhone);
};
