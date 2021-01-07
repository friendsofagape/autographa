import * as logger from '../logger';

const crypto = require('crypto');

//  generates random string of characters i.e salt
const randomString = (length) => {
  logger.debug('hashing.js', 'Generating salt in randomString');
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

//  Hash using algorithm sha512 and salt
export const hash = (password, salt) => {
  logger.debug('hashing.js', ' Inside hash');
  const hashed = crypto.createHmac('sha512', salt);
  hashed.update(password);
  const value = hashed.digest('hex');
  logger.debug('hashing.js', 'Exiting from hash after hanshing the password');
  return {
    salt,
    password: value,
  };
};

export const HashPassword = (userPassword) => {
  logger.debug('hashing.js', 'Inside HashPassword');
  // Generate salt of length 16
  const salt = randomString(16);
  const passwordData = hash(userPassword, salt);
  logger.debug('hashing.js', 'Exiting from HashPassword');
  return passwordData;
};
