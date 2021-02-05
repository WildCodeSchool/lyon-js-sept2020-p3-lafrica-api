ALTER TABLE
  `user` CHANGE COLUMN `lastname` `lastname` VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL DEFAULT NULL,
  CHANGE COLUMN `firstname` `firstname` VARCHAR(255) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NULL DEFAULT NULL;