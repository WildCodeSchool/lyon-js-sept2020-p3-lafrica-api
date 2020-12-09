const { findAllCampaigns } = require('../models/campaigns');

module.exports.getCollection = async (req, res) => {
  const [data] = await findAllCampaigns();
  res.json(data);
};
