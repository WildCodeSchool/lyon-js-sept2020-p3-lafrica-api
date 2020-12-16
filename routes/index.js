// const thingsRoutes = require('./things');
const campaignsRouter = require('./campaigns');
const usersRouter = require('./users');
const authRoutes = require('./auth');

module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/campaigns', campaignsRouter);
  app.use('/users', usersRouter);
  app.use('/auth', authRoutes);
};
