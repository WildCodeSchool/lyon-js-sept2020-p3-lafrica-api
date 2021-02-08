const db = require('../db');
const { mailing_campaign } = require('../db').prisma;

module.exports.findAllCampaigns = (id) => {
  return mailing_campaign.findMany({
    where: {
      id: parseInt(id, 10),
    },
  });
};
module.exports.findUsersCampaigns = async (
  id,
  limit,
  offset,
  name,
  orderBy
) => {
  const campaigns = await mailing_campaign.findMany({
    where: {
      id_client_user: id,
      name: {
        contains: name || undefined,
      },
    },
    orderBy,
    take: limit,
    skip: offset,
  });

  const total = (
    await mailing_campaign.aggregate({
      where: {
        id_client_user: id,
      },
      count: true,
    })
  ).count;
  return [total, campaigns];
};

module.exports.findOneCampaign = async (id) => {
  const campaignData = await mailing_campaign.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });

  if (campaignData) {
    return campaignData;
  }
  return null;
};

module.exports.findAllClientCampaigns = async (
  limit,
  offset,
  name,
  orderBy,
  firstname,
  lastname
) => {
  const campaigns = await mailing_campaign.findMany({
    include: {
      user: true,
    },
    where: {
      name: {
        contains: name || undefined,
      },
      user: {
        firstname: {
          contains: firstname || undefined,
        },
        lastname: {
          contains: lastname || undefined,
        },
      },
    },
    orderBy,
    take: limit,
    skip: offset,
  });

  const total = (
    await mailing_campaign.aggregate({
      count: true,
    })
  ).count;

  const result = campaigns.map((campaign) => {
    const newData = {
      ...campaign,
      firstname: campaign.user.firstname,
      lastname: campaign.user.lastname,
      email: campaign.user.email,
    };
    delete newData.user;
    return newData;
  });

  return [total, result];
};

module.exports.createCampaignId = async (user_id) => {
  try {
    const data = await db.query(
      'INSERT INTO mailing_campaign (id_client_user,name,text_message,vocal_message_file_url,date, sending_status) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, null, null, null, null, false]
    );
    const insertedCampaign = await db.query(
      'SELECT * FROM mailing_campaign WHERE id = ?',
      [data.insertId]
    );
    return insertedCampaign[0];
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports.updateCampaign = async (campaign_id, campaignDatas) => {
  const {
    campaign_name,
    campaign_text,
    campaign_vocal,
    campaign_date,
  } = campaignDatas;
  const campaign_date_formated = new Date(campaign_date);
  try {
    await mailing_campaign.update({
      data: {
        name: campaign_name,
        text_message: campaign_text,
        vocal_message_file_url: campaign_vocal,
        date: campaign_date_formated,
      },
      where: {
        id: parseInt(campaign_id, 10),
      },
    });

    const data = await this.findOneCampaign(campaign_id);
    return data;
  } catch (err) {
    return err;
  }
};

module.exports.assignContactsToCampaign = async (contactsList, campaignId) => {
  try {
    contactsList.forEach(async (contact) => {
      const existingContactCheck = await db.query(
        'SELECT * FROM contact_in_mailing_campaign WHERE contact_id = ? AND mailing_campaign_id = ?',
        [contact.id, campaignId]
      );
      if (existingContactCheck.length === 0) {
        // eslint-disable-next-line no-lone-blocks
        await db.query(
          'INSERT INTO contact_in_mailing_campaign (contact_id,mailing_campaign_id,sending_status) VALUES (?, ?, false)',
          [contact.id, campaignId]
        );
      }
    });
    return contactsList.length;
  } catch (err) {
    return err;
  }
};

const checkIfCampaignNotSend = async (id) => {
  const check = await mailing_campaign.findMany({
    where: {
      id: parseInt(id, 10),
      sending_status: {
        not: 2,
      },
    },
  });

  const date = Date.now() - 180000;
  const formated_date = new Date(date);

  if (check.length) {
    if (check[0].date > formated_date || !check[0].date) {
      return true;
    }
    return false;
  }
  return false;
};

module.exports.stopCampaign = async (campaign_id) => {
  const check = await checkIfCampaignNotSend(campaign_id);
  if (check) {
    await db.query(
      'UPDATE mailing_campaign SET date = NULL, sending_status = 0 WHERE id = ?',
      [campaign_id]
    );
    const result = await this.findOneCampaign(campaign_id);
    return result;
  }
  return false;
};

module.exports.deleteCampaign = async (campaignId) => {
  await db
    .query('DELETE FROM mailing_campaign WHERE id = ?', [campaignId])
    .catch((err) => {
      console.log(err);
      throw err;
    });
  return this.findOneCampaign(campaignId);
};
