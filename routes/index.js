// const thingsRoutes = require('./things');
const campaignsRouter = require('./campaigns');

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/campaigns', campaignsRouter);
};
