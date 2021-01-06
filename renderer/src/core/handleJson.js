import * as localForage from 'localforage';
import * as logger from '../logger';

const path = require('path');

let error;
const uniqueUser = (users, email) => users.some((user) => user.email === email);

export const loadUsers = async (fs) => {
  const file = path.join('Autogrpha-DB', 'DB.json');
  if (fs.existsSync(file)) {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        logger.error(
          'handleJson.js',
          'Failed to read the data from file',
        );
      } else {
        logger.debug(
          'handleJson.js',
          'Successfully read the data from file',
        );
        // Add users to localForage:
        localForage.setItem('users', JSON.parse(data), (errLoc) => {
          if (errLoc) {
            logger.error(
              'handleJson.js',
              'Failed to load users list to LocalStorage',
            );
          }
          logger.debug(
            'handleJson.js',
            'Added users list to LocalStorage',
          );
        });
      }
    });
  }
};

export const handleJson = async (values, fs) => {
  logger.debug('handleJson.js', 'Inside handleJson');
  //   console.log('global', global.path);
  fs.mkdirSync(path.join('Autogrpha-DB'), {
    recursive: true,
  });
  const file = path.join('Autogrpha-DB', 'DB.json');
  error = { userExist: false, fetchFile: false };
  if (fs.existsSync(file)) {
    return new Promise((resolve) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          logger.error(
            'handleJson.js',
            'Failed to read the data from file',
          );
          error.fetchFile = true;
          resolve(error);
        } else {
          logger.debug(
            'handleJson.js',
            'Successfully read the data from file',
          );
          const json = JSON.parse(data);
          if (uniqueUser(json, values.email)) {
            error.userExist = true;
            resolve(error);
          } else {
            json.push(values);
            try {
              fs.writeFileSync(file, JSON.stringify(json));
              logger.debug(
                'handleJson.js',
                'Successfully added new user to the existing list in file',
              );
              // Add new user to localForage:
              localForage.setItem('users', json, (errLoc) => {
                if (errLoc) {
                  logger.error(
                    'handleJson.js',
                    'Failed to add new user to existing list',
                  );
                }
                logger.debug(
                  'handleJson.js',
                  'Added new user to existing list',
                );
              });
              resolve(error);
            } catch (errCatch) {
              logger.error(
                'handleJson.js',
                'Failed to add new user to the file',
              );
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
      'handleJson.js',
      'Successfully created and written to the file',
    );
    // Add new user to localForage:
    localForage.setItem('users', array, (err) => {
      if (err) {
        logger.error(
          'handleJson.js',
          'Failed to Create a file and add user to LocalForage',
        );
      }
      logger.debug(
        'handleJson.js',
        'Created a file and added user to LocalForage',
      );
    });
    logger.debug('handleJson.js', 'Exiting from handleJson');
    return error;
  } catch (err) {
    logger.error('handleJson.js', 'Failed to create and write to the file');
    error.fetchFile = true;
    return error;
  }
};
