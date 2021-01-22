ALTER TABLE
  mailing_campaign CHANGE name name VARCHAR(255);
ALTER TABLE
  mailing_campaign CHANGE text_message text_message varchar(255);
ALTER TABLE
  mailing_campaign CHANGE vocal_message_file_url vocal_message_file_url varchar(255);
ALTER TABLE
  mailing_campaign CHANGE date date datetime;
ALTER TABLE
  `contact_in_mailing_campaign` DROP FOREIGN KEY `fk_contact_has_mailing_campaign_contact1`,
  DROP FOREIGN KEY `fk_contact_has_mailing_campaign_mailing_campaign1`;
ALTER TABLE
  `contact_in_mailing_campaign`
ADD
  CONSTRAINT `fk_contact_has_mailing_campaign_contact1` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
ADD
  CONSTRAINT `fk_contact_has_mailing_campaign_mailing_campaign1` FOREIGN KEY (`mailing_campaign_id`) REFERENCES `mailing_campaign` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE
  `contact` DROP FOREIGN KEY `fk_contact_client user1`;
ALTER TABLE
  `contact`
ADD
  CONSTRAINT `fk_contact_client user1` FOREIGN KEY (`id_client_user`) REFERENCES `user` (`id`) ON DELETE CASCADE;
ALTER TABLE
  `mailing_campaign` DROP FOREIGN KEY `fk_mailing_campaign_client user1`;
ALTER TABLE
  `mailing_campaign`
ADD
  CONSTRAINT `fk_mailing_campaign_client user1` FOREIGN KEY (`id_client_user`) REFERENCES `user` (`id`) ON DELETE CASCADE;