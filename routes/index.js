// const thingsRoutes = require('./things');
const campaignsRouter = require('./campaigns');
const usersRouter = require('./users');
const authRoutes = require('./auth');
const sendVocalToPhone = require('./sendVocalToPhone');

const requireCurrentUser = require('../middlewares/requireCurrentUser');

// eslint-disable-next-line
module.exports = (app) => {
  // app.use('/things', thingsRoutes);
  app.use('/users', usersRouter);
  app.use('/users/:user_id/campaigns', requireCurrentUser, campaignsRouter);
  app.use('/auth', authRoutes);
  app.use('/voice/sendVocalMessage', sendVocalToPhone);
};

/* 

/users 
  / signUp (à déplacer dans /auth)
  /:user_id (middleware validation loggé ?)
    /createCampaign
    /campaigns
      /:campaign_id
  
/ auth 
  / login 
  / logout 
  
  */
