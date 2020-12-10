// const thingsRoutes = require('./things');
const campaignsRouter = require('./campaigns');

module.exports = (app) => {
  app.use('/campaigns', campaignsRouter);
};
