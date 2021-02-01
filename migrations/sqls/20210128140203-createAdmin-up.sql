INSERT INTO
  user(
    firstname,
    lastname,
    email,
    encrypted_password,
    phone_number,
    role
  )
VALUES
  (
    'LAfrica',
    'Mobile',
    'contact.lafricamobile@gmail.com',
    '$argon2i$v=19$m=4096,t=3,p=1$01YLYgj1/FKgiIbfq6WgCA$pTzfCyUZ4CwHwXFA14e9HwyjBwSk9rIFd4hxL/pGfw0',
    '33606060606',
    role = 'admin'
  );