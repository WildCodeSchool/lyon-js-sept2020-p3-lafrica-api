const { findAllCampaigns } = require('../models/campaigns');
const quickStart = require('../services/textToSpeech');

module.exports.getCollection = async (req, res) => {
  const [data] = await findAllCampaigns();
  res.json(data);
};

module.exports.vocalization = async () => {
  quickStart();
};
