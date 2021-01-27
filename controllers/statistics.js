const Calls = require('../models/statistics');

module.exports.getAllCalls = async (req, res) => {
  if (req.currentUser.role === 'admin') {
    const callsDatas = await Calls.getAllCallsFromDb();
    const totalCampaigns = await Calls.getAllSendCampaignsFromDb();
    const totalCampaignsPerUsers = await Calls.getAllSendCampaignsFromUsers();
    const { total } = totalCampaigns;
    return res.json({
      callsDatas,
      totalCampaignsSent: total,
      totalCampaignsPerUsers,
    });
  }
  return res.sendStatus(401);
};
