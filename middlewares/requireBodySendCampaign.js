module.exports = (req, res, next) => {
  if (
    !req[0].campaign_name ||
    !req[0].campaign_text ||
    !req[0].campaign_vocal ||
    !req[0].campaign_date
  ) {
    return res.status(400).send({
      errorMessage: `Calling this route without all bodies required field (campaign name, text to vocalize, vocalized text or campaign date will occur an error).`,
    });
  }
  if (req[1].length === 0) {
    return res.status(400).send({
      errorMessage: `Calling this route without any phone numbers will occur an error).`,
    });
  }
  return next();
};
