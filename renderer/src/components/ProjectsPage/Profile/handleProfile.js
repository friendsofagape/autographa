import * as localForage from 'localforage';
import { loadUsers } from '../../../core/Login/handleJson';
import * as logger from '../../../logger';

const updateJson = (userdata) => {
  logger.error('handleProfile.js', 'In UpdateJson, for updating the current user details');
  const newpath = localStorage.getItem('userPath');
  const fs = window.require('fs');
  const path = require('path');
  const file = path.join(newpath, 'autographa', 'users', 'users.json');
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      logger.error('handleProfile.js', 'Failed to read the data from file');
    } else {
      logger.debug('handleProfile.js', 'Successfully read the data from file');
      const json = JSON.parse(data);
      json.forEach((user) => {
        if (user.username === userdata.username) {
          const keys = Object.keys(user);
          keys.forEach((key) => {
            // eslint-disable-next-line no-param-reassign
            user[key] = userdata[key];
          });
        }
      });
      logger.debug('handleProfile.js', 'Upadting the user details in existing file');
      fs.writeFileSync(file, JSON.stringify(json));
      logger.debug('handleProfile.js', 'Loading new users list from file');
      loadUsers();
    }
  });
};
const updateOffline = (data) => {
  localForage.getItem('userProfile')
  .then((userdata) => {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      userdata[key] = data[key];
    });
    localForage.setItem('userProfile', userdata);
    updateJson(userdata);
  });
};
export const saveProfile = (values) => {
  localForage.getItem('appMode')
  .then((mode) => {
    if (mode === 'offline') {
      updateOffline(values);
    }
  });
};
