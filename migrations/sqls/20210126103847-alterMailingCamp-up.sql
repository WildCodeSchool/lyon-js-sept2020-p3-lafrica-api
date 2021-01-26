ALTER TABLE
  mailing_campaign
ADD
  COLUMN count INT NULL
AFTER
  lam_campaign_id,
ADD
  COLUMN call_success_count INT NULL
AFTER
  count,
ADD
  COLUMN call_failed_count INT NULL
AFTER
  call_success_count,
ADD
  COLUMN call_ignored_count INT NULL
AFTER
  call_failed_count;