// const thingsRoutes = require('./things');
const campaignsRouter = require('./campaigns');
const usersRouter = require('./users');

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/campaigns', campaignsRouter);
  app.use('/users', usersRouter);
};
