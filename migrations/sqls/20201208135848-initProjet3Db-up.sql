DROP TABLE IF EXISTS `mailing_campaign_to_contact`;
DROP TABLE IF EXISTS `mailing_campaign`;
DROP TABLE IF EXISTS `contact`;
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(45) NOT NULL,
  `role` VARCHAR(45) NOT NULL,
  `manager_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_User_User1_idx` (`manager_id` ASC) VISIBLE,
  CONSTRAINT `fk_User_User1` FOREIGN KEY (`manager_id`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `Contact`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Contact` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lastname` VARCHAR(255) NULL,
  `firstname` VARCHAR(255) NULL,
  `phone_number` INT NOT NULL,
  `id_client_user` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Contact_Client user1_idx` (`id_client_user` ASC) VISIBLE,
  CONSTRAINT `fk_Contact_Client user1` FOREIGN KEY (`id_client_user`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = armscii8;
-- -----------------------------------------------------
-- Table `Mailing_campaign`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Mailing_campaign` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_client_user` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `text_message` VARCHAR(255) NOT NULL,
  `vocal_message_file_url` VARCHAR(255) NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Mailing_campaign_Client user1_idx` (`id_client_user` ASC) VISIBLE,
  CONSTRAINT `fk_Mailing_campaign_Client user1` FOREIGN KEY (`id_client_user`) REFERENCES `User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `Contact_in_Mailing_campaign`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Contact_in_Mailing_campaign` (
  `Contact_id` INT NOT NULL,
  `Mailing_campaign_id` INT NOT NULL,
  `sending_status` VARCHAR(45) NOT NULL COMMENT "Status d\'envoi sur le numéro",
  PRIMARY KEY (`Contact_id`, `Mailing_campaign_id`),
  INDEX `fk_Contact_has_Mailing_campaign_Mailing_campaign1_idx` (`Mailing_campaign_id` ASC) VISIBLE,
  INDEX `fk_Contact_has_Mailing_campaign_Contact1_idx` (`Contact_id` ASC) VISIBLE,
  CONSTRAINT `fk_Contact_has_Mailing_campaign_Contact1` FOREIGN KEY (`Contact_id`) REFERENCES `Contact` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Contact_has_Mailing_campaign_Mailing_campaign1` FOREIGN KEY (`Mailing_campaign_id`) REFERENCES `Mailing_campaign` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = armscii8;