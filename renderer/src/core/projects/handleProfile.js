import * as localForage from 'localforage';
import i18n from '../../translations/i18n';
import { loadUsers } from '../Login/handleJson';
import * as logger from '../../logger';

const updateJson = async (userdata, languageId) => {
  logger.error('handleProfile.js', 'In UpdateJson, for updating the current user details');
  const newpath = localStorage.getItem('userPath');
  const fs = window.require('fs');
  const path = require('path');
  const file = path.join(newpath, 'autographa', 'users', 'users.json');
  const status = [];
  try {
    const data = fs.readFileSync(file);
    const json = JSON.parse(data);
    json.forEach((user) => {
      if (user.username === userdata.username) {
        const keys = Object.keys(user);
        keys.forEach((key) => {
          user[key] = userdata[key];
        });
      }
    });
    logger.debug('handleProfile.js', 'Updating the user details in existing file');
    fs.writeFileSync(file, JSON.stringify(json));
    status.push({ type: 'success', value: 'Updated the Profile.' });
    const setting = path.join(newpath, 'autographa', 'users', userdata.username, 'ag-user-settings.json');
    fs.readFile(setting, (err, data) => {
      const json = JSON.parse(data);
      json.appLanguage = languageId;
      logger.debug('handleProfile.js', 'Updating the app language in the file');
      fs.writeFileSync(setting, JSON.stringify(json));
      i18n.changeLanguage(languageId);
      status.push({ type: 'success', value: 'App language changed.' });
    });
    logger.debug('handleProfile.js', 'Loading new users list from file');
    loadUsers();
  } catch {
    logger.error('handleProfile.js', 'Failed to read the data from file');
    status.push({ type: 'error', value: 'Failed to read the data from file.' });
  }
  return status[0];
};
const updateOffline = async (data, languageId) => {
  logger.debug('handleProfile.js', 'In updateOffline');
  const status = [];
  await localForage.getItem('userProfile')
  .then(async (userdata) => {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      userdata[key] = data[key];
    });
    logger.debug('handleProfile.js', 'Updating profile data in localForage');
    localForage.setItem('userProfile', userdata);
    const value = updateJson(userdata, languageId);
    value.then((val) => {
      status.push(val);
    });
  });
  return status;
};
export const saveProfile = async (values, languageId) => {
  logger.debug('handleProfile.js', 'In saveProfile');
  const status = [];
  await localForage.getItem('appMode')
  .then(async (mode) => {
    if (mode === 'offline') {
      const value = await updateOffline(values, languageId);
      status.push(value[0]);
    }
  });
  return status;
};
