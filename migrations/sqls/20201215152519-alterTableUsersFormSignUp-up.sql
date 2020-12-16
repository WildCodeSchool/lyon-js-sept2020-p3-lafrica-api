ALTER TABLE
  `User`
ADD
  COLUMN `lastname` VARCHAR(255) NOT NULL
AFTER
  `firstname`,
  CHANGE COLUMN `username` `firstname` VARCHAR(255) NOT NULL,
  CHANGE COLUMN `password` `encrypted_password` VARCHAR(255) NOT NULL,
  CHANGE COLUMN `role` `role` VARCHAR(45) NULL;