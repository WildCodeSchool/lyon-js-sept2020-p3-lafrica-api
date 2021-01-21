ALTER TABLE
  `mailing_campaign`
ADD
  COLUMN sending_status TINYINT NOT NULL DEFAULT 0
AFTER
  date;