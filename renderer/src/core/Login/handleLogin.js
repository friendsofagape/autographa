import * as localforage from 'localforage';
import { handleJson } from './handleJson';
import * as logger from '../../logger';

export const createUser = (values, fs) => {
  logger.debug('handleLogin.js', 'In createUser to create a new user');
  const obj = {
    username: values.username,
    firstname: '',
    lastname: '',
    email: '',
    organization: '',
    selectedregion: '',
    lastSeen: new Date(),
  };
  return handleJson(obj, fs).then(() => obj);
};

/**
 * It writes the users to a file.
 * @param users - [{
 */
const writeToFile = (users) => {
  const newpath = localStorage.getItem('userPath');
  const fs = window.require('fs');
  const path = require('path');
  const file = path.join(newpath, 'autographa', 'users', 'users.json');
  fs.writeFileSync(file, JSON.stringify(users), (err) => {
    if (err) {
      logger.debug('handleLogin.js', 'Error saving users to disk');
    }
  });
};

/**
 * It takes an array of users and a username and returns the user object if the username is found in
 * the array.
 * @param users - [{username: 'test', password: 'test', lastSeen: '2019-01-01'}]
 * @param values - {
 * @returns The user object.
 */
export const handleLogin = async (users, values) => {
  logger.debug('handleLogin.js', 'In handleLogin function');
  if (users) {
    const user = users.find((value) => value.username === values.username);
    if (user) {
      user.lastSeen = new Date();
      logger.debug('handleLogin.js', 'Found user');
      users.map((obj) => user.username === obj.username || obj);
      writeToFile(users);
      await localforage.setItem('users', users);
      return user;
    }
  }
  return null;
};
