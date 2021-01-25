ALTER TABLE
  user
ADD
  COLUMN resetPasswordToken VARCHAR(255);
ALTER TABLE
  user
ADD
  COLUMN resetPasswordExpires datetime;
ALTER TABLE
  mailing_campaign CHANGE COLUMN sending_status sending_status INT NOT NULL DEFAULT '0';