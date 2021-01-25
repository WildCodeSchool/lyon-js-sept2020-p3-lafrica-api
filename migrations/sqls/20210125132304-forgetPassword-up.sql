ALTER TABLE
  user
ADD
  COLUMN resetPasswordToken VARCHAR(255);
ALTER TABLE
  user
ADD
  COLUMN resetPasswordExpires datetime;