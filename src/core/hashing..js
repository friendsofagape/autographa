import { logger } from "../logger";
var crypto = require("crypto");

//  generates random string of characters i.e salt
const randomString = function (length) {
  logger.debug("hashing.js, Generating salt in randomString");
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

//  Hash using algorithm sha512 and salt
export const hash = function (password, salt) {
  logger.debug("hashing.js, Inside hash");
  var hashed = crypto.createHmac("sha512", salt);
  hashed.update(password);
  var value = hashed.digest("hex");
  logger.debug("hashing.js, Exiting from hash after hanshing the password");
  return {
    salt: salt,
    password: value,
  };
};

export const HashPassword = (userPassword) => {
  logger.debug("hashing.js, Inside HashPassword");
  // Generate salt of length 16
  var salt = randomString(16);
  var passwordData = hash(userPassword, salt);
  logger.debug("hashing.js, Exiting from HashPassword");
  return passwordData;
};
