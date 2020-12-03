CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE TABLE IF NOT EXISTS `contact` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lastname` VARCHAR(255) NULL,
  `firstname` VARCHAR(255) NULL,
  `phone_number` VARCHAR(30) NOT NULL,
  `owner_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `contact_fk_owner` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE TABLE `mailing_campaign` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `owner_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `text_message` VARCHAR(255) NOT NULL,
  `vocal_message_file_url` VARCHAR(255) NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `mailing_campaign_fk_owner` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE TABLE `mailing_campaign_to_contact` (
  `contact_id` INT NOT NULL,
  `mailing_campaign_id` INT NOT NULL,
  `sending_status` VARCHAR(45) NOT NULL DEFAULT 'not_sent',
  PRIMARY KEY (`contact_id`, `mailing_campaign_id`),
  CONSTRAINT `mailing_campaign_to_contact_fk_contact` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON DELETE CASCADE,
  CONSTRAINT `mailing_campaign_to_contact_fk_mailing` FOREIGN KEY (`mailing_campaign_id`) REFERENCES `mailing_campaign` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;