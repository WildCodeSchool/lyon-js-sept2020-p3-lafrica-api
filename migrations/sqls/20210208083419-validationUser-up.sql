ALTER TABLE
  `user`
ADD
  COLUMN `user_confirmed` TINYINT NOT NULL DEFAULT 0
AFTER
  `role`;