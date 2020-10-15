import * as localForage from 'localforage';
import { logger } from '../logger';
import { HashPassword } from './hashing.';

const path = require('path');

let remote; let app; let
  fs;
if (process.env.NODE_ENV === 'test') {
  remote = require('electron').remote;
  app = remote.app;
  fs = require('fs');
} else {
  remote = window.require('electron').remote;
  app = remote.app;
  fs = remote.require('fs');
}
export const handleJson = async (values) => {
  logger.debug('handleJson.js, Inside handleJson');
  const file = path.join(app.getPath('userData'), 'DB.json');
  const hashedPassword = HashPassword(values.password);
  const error = { userExist: false, fetchFile: false };
  values.password = hashedPassword.password;
  values.salt = hashedPassword.salt;
  if (fs.existsSync(file)) {
    return new Promise((resolve) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          logger.error('handleJson.js,Failed to read the data from file');
          error.fetchFile = true;
          resolve(error);
        } else {
          logger.debug('handleJson.js,Successfully read the data from file');
          const json = JSON.parse(data);
          if (uniqueUser(json, values.email)) {
            error.userExist = true;
            resolve(error);
          } else {
            json.push(values);
            try {
              fs.writeFileSync(file, JSON.stringify(json));
              logger.debug(
                'handleJson.js,Successfully added new user to the existing list in file',
              );
              // Add new user to localForage:
              localForage.setItem('users', json, (err) => {
                if (err) {
                  logger.error(
                    'handleJson.js, Failed to add new user to existing list',
                  );
                }
                logger.debug('handleJson.js, Added new user to existing list');
              });
              resolve(error);
            } catch (err) {
              logger.error('handleJson.js,Failed to add new user to the file');
              resolve(error);
            }
          }
        }
      });
    });
  }
  const array = [];
  array.push(values);
  try {
    fs.writeFileSync(file, JSON.stringify(array));
    logger.debug(
      'handleJson.js,Successfully created and written to the file',
    );
    // Add new user to localForage:
    localForage.setItem('users', array, (err) => {
      if (err) {
        logger.error(
          'handleJson.js, Failed to Create a file and add user to LocalForage',
        );
      }
      logger.debug(
        'handleJson.js, Created a file and added user to LocalForage',
      );
    });
    logger.debug('handleJson.js, Exiting from handleJson');
    return error;
  } catch (err) {
    logger.error('handleJson.js,Failed to create and write to the file');
    error.fetchFile = true;
    return err;
  }
};

const uniqueUser = (users, email) => users.some((user) => user.email === email);
