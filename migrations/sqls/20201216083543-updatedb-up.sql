/* Replace with your SQL commands */
SET
  FOREIGN_KEY_CHECKS = 0;
SET
  @tables = NULL;
SELECT
  GROUP_CONCAT('', table_schema, '.', table_name, '') INTO @tables
FROM
  information_schema.tables
WHERE
  table_schema = 'p3_api_database'
  AND table_name <> 'migrations';
-- specify DB name here.
SET
  @tables = CONCAT('DROP TABLE ', @tables);
PREPARE stmt
FROM
  @tables;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET
  FOREIGN_KEY_CHECKS = 1;
CREATE TABLE IF NOT EXISTS `user` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `encrypted_password` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(45) NOT NULL,
    `role` VARCHAR(45) NULL,
    `manager_id` INT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_user_user1_idx` (`manager_id` ASC),
    CONSTRAINT `fk_user_user1` FOREIGN KEY (`manager_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
  -- Table `contact`
  -- -----------------------------------------------------
  CREATE TABLE IF NOT EXISTS `contact` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `lastname` VARCHAR(255) NULL,
    `firstname` VARCHAR(255) NULL,
    `phone_number` INT NOT NULL,
    `id_client_user` INT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_contact_client user1_idx` (`id_client_user` ASC),
    CONSTRAINT `fk_contact_client user1` FOREIGN KEY (`id_client_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
  -- Table `mailing_campaign`
  -- -----------------------------------------------------
  CREATE TABLE IF NOT EXISTS `mailing_campaign` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_client_user` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `text_message` VARCHAR(255) NOT NULL,
    `vocal_message_file_url` VARCHAR(255) NOT NULL,
    `date` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_mailing_campaign_client user1_idx` (`id_client_user` ASC),
    CONSTRAINT `fk_mailing_campaign_client user1` FOREIGN KEY (`id_client_user`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
  -- Table `contact_in_mailing_campaign`
  -- -----------------------------------------------------
  CREATE TABLE IF NOT EXISTS `contact_in_mailing_campaign` (
    `contact_id` INT NOT NULL,
    `mailing_campaign_id` INT NOT NULL,
    `sending_status` VARCHAR(45) NOT NULL COMMENT "Status d\'envoi sur le numéro",
    PRIMARY KEY (`contact_id`, `mailing_campaign_id`),
    INDEX `fk_contact_has_mailing_campaign_mailing_campaign1_idx` (`mailing_campaign_id` ASC),
    INDEX `fk_contact_has_mailing_campaign_contact1_idx` (`contact_id` ASC),
    CONSTRAINT `fk_contact_has_mailing_campaign_contact1` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_contact_has_mailing_campaign_mailing_campaign1` FOREIGN KEY (`mailing_campaign_id`) REFERENCES `mailing_campaign` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;