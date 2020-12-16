const db = require("../db");

module.exports.findAllCampaigns = () => {
  return db.query("SELECT * FROM mailing_campaign");
};

