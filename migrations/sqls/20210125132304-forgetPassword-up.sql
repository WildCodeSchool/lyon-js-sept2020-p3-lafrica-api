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
ALTER TABLE
  mailing_campaign
ADD
  COLUMN lam_campaign_id INT NULL DEFAULT NULL
AFTER
  sending_status;
ALTER TABLE
  contact_in_mailing_campaign
ADD
  COLUMN lam_contact_id INT NULL DEFAULT NULL
AFTER
  sending_status,
ADD
  COLUMN call_state_id INT NULL DEFAULT NULL
AFTER
  lam_contact_id,
ADD
  COLUMN call_result_id INT NULL DEFAULT NULL
AFTER
  call_state_id;