--
-- Table structure for table `user`
--
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `encrypted_password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `phone_number` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  `role` varchar(45) COLLATE utf8mb4_bin DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_user1_idx` (`manager_id`),
  CONSTRAINT `fk_user_user1` FOREIGN KEY (`manager_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_bin;
--
-- Table structure for table `contact`
--
CREATE TABLE `contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lastname` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `phone_number` int(11) NOT NULL,
  `id_client_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_contact_client user1_idx` (`id_client_user`),
  CONSTRAINT `fk_contact_client user1` FOREIGN KEY (`id_client_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_bin;
--
-- Table structure for table `mailing_campaign`
--
CREATE TABLE `mailing_campaign` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_client_user` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `text_message` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `vocal_message_file_url` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_mailing_campaign_client user1_idx` (`id_client_user`),
  CONSTRAINT `fk_mailing_campaign_client user1` FOREIGN KEY (`id_client_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_bin;
--
-- Table structure for table `contact_in_mailing_campaign`
--
CREATE TABLE `contact_in_mailing_campaign` (
  `contact_id` int(11) NOT NULL,
  `mailing_campaign_id` int(11) NOT NULL,
  `sending_status` varchar(45) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`contact_id`, `mailing_campaign_id`),
  KEY `fk_contact_has_mailing_campaign_mailing_campaign1_idx` (`mailing_campaign_id`),
  KEY `fk_contact_has_mailing_campaign_contact1_idx` (`contact_id`),
  CONSTRAINT `fk_contact_has_mailing_campaign_contact1` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_contact_has_mailing_campaign_mailing_campaign1` FOREIGN KEY (`mailing_campaign_id`) REFERENCES `mailing_campaign` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_bin;