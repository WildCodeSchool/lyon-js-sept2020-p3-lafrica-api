const db = require("../db");

module.exports.findAllCampaigns = (id) => {
  return db.query("SELECT * FROM mailing_campaign WHERE id = ?", [id]);
};
