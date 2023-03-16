import {
    readContent, createRepository, createContent, updateContent,
  } from 'gitea-react-toolkit';
import moment from 'moment';
import * as localForage from 'localforage';
import * as logger from '../../../logger';

// create repo for new project sync
export const handleCreateRepo = async (repoName, auth, description) => {
    const settings = {
      name: repoName,
      description: description || `${repoName}`,
      private: false,
    };
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      await createRepository(
        {
          config: auth.config,
          repo: settings?.name,
          settings,
        },
      ).then((result) => {
        logger.debug('Dropzone.js', 'call to create repo from Gitea');
        // console.log("create repo : ", result);
        resolve(result);
      }).catch((err) => {
        logger.debug('Dropzone.js', 'call to create repo from Gitea Error : ', err);
        // console.log("create repo : ", result);
        resolve(err);
      });
    });
  };

// upload file to gitea
export const createFiletoServer = async (fileContent, filePath, branch, repoName, auth) => {
    await createContent({
      config: auth.config,
      owner: auth.user.login,
      // repo: repo.name,
      repo: repoName,
      branch,
      filepath: filePath,
      content: fileContent,
      message: `commit ${filePath}`,
      author: {
        email: auth.user.email,
        username: auth.user.username,
      },
    }).then(() => {
      logger.debug('SyncToGiteaUtils.js', `file uploaded to Gitea ${filePath}`);
    //   console.log('RESPONSE :', res);
    })
    .catch((err) => {
      logger.debug('SyncToGiteaUtils.js', `failed to upload file to Gitea ${filePath} ${err}`);
      console.log(`path : ${filePath}`, ' , : error : ', err);
      // eslint-disable-next-line no-throw-literal
      throw { error: err };
    });
  };

// update file in gitea
export const updateFiletoServer = async (fileContent, filePath, branch, repoName, auth) => {
  await readContent(
    {
      config: auth.config,
      owner: auth.user.login,
      repo: repoName.toLowerCase(),
      // ref: `${username}/${created}.1`,
      ref: branch,
      filepath: filePath,
    },
  ).then(async (result) => {
    logger.debug('Dropzone.js', 'sending the data from Gitea with content');
    if (result === null) {
      // eslint-disable-next-line no-throw-literal
      throw 'can not read repo';
    }
    await updateContent({
      config: auth.config,
      owner: auth.user.login,
      repo: repoName.toLowerCase(),
      branch,
      filepath: result.path,
      content: fileContent,
      message: `updated ${filePath}`,
      author: {
        email: auth.user.email,
        username: auth.user.username,
      },
      sha: result.sha,
    // eslint-disable-next-line no-unused-vars
    }).then((res) => {
      logger.debug('Dropzone.js', 'file uploaded to Gitea \'metadata.json\'');
      // console.log('RESPONSE :', res);
    })
    .catch((err) => {
      logger.debug('Dropzone.js', 'failed to upload file to Gitea \'metadata.json\'', err);
      console.log(filePath, ' : error : ', err);
    });
  });
};

// sync profile updation
export const createSyncProfile = async (auth) => {
  const fs = window.require('fs');
  const path = require('path');
  await localForage.getItem('userProfile').then(async (user) => {
    const currentUser = user?.username;
    const newpath = localStorage.getItem('userPath');
    const file = path.join(newpath, 'autographa', 'users', currentUser, 'ag-user-settings.json');
    if (fs.existsSync(file)) {
      await fs.readFile(file, async (err, data) => {
        if (err) {
          logger.error('SyncToGiteaUtils.js', 'Failed to read the data from file');
        } else {
        logger.debug('SyncToGiteaUtils.js', 'Successfully read the data from file');
        const json = JSON.parse(data);
        // console.log("user json : ",json);
        if (!json.sync && !json.sync?.services) {
          // first time sync
          json.sync = {
            services: {
              door43: [
                {
                  token: '',
                  expired: false,
                  default: false,
                  username: auth?.user?.username,
                  dateCreated: moment().format(),
                  dateModified: null,
                },
              ],
            },
          };
        } else if (!json.sync?.services?.door43?.some((element) => element.username === auth?.user?.username)) {
            // user not in list create new entry
            json.sync?.services?.door43?.push(
              {
                token: '',
                expired: false,
                default: false,
                username: auth?.user?.username,
                dateCreated: moment().format(),
                dateModified: null,
              },
            );
          }
        // add token to file on login - used in editor sync
        // eslint-disable-next-line array-callback-return
        json.sync?.services?.door43?.filter((element) => {
            if (element.username === auth?.user?.username) {
              element.expired = false;
              element.dateModified = moment().format();
              element.token = {
                config: auth.config,
                token: auth.token,
                user: {
                  email: auth.user.email,
                  username: auth.user.username,
                  login: auth.user.login,
                  id: auth.user.id,
                },
              };
            }
          });
        logger.debug('GiteaFileBrowser.js', 'Upadting the settings in existing file');
        await fs.writeFileSync(file, JSON.stringify(json));
      }
      });
    }
  });
};

// get or update last sync details in ag settings
export const getOrPutLastSyncInAgSettings = async (method, projectMeta, syncUsername) => {
  if (method === 'get' || method === 'put') {
    let currentUser = await localForage.getItem('userProfile');
    currentUser = currentUser?.username;
    const fs = window.require('fs');
    const path = require('path');
    const newpath = localStorage.getItem('userPath');
    const id = Object.keys(projectMeta?.identification?.primary?.ag);
    const projectName = `${projectMeta?.identification?.name?.en}_${id}`;
    // eslint-disable-next-line array-callback-return
    const settingsIngredientsPath = Object.keys(projectMeta?.ingredients).filter((path) => {
      if (path.includes('ag-settings.json')) {
        return path;
      }
    });
    // console.log({ projectName, settingsIngredientsPath, currentUser });
    if (settingsIngredientsPath) {
      const settingsPath = path.join(newpath, 'autographa', 'users', currentUser, 'projects', projectName, settingsIngredientsPath[0]);

      let settings = await fs.readFileSync(settingsPath);
      settings = JSON.parse(settings);
      if (method.toLowerCase() === 'get') {
        let lastSyncedObj;
        settings?.sync?.services?.door43.forEach((element, indx) => {
          if (indx === 0) {
            lastSyncedObj = element;
          } else if (element.lastSynced > lastSyncedObj.lastSynced) {
              lastSyncedObj = element;
            }
        });
        return lastSyncedObj;
      }
      if (method.toLowerCase() === 'put') {
        console.log('inside PUT =====');
        if (!settings.sync && !settings.sync?.services) {
          // first time sync - no sync in settings old projects
          settings.sync = {
            services: {
              door43: [
                {
                  username: syncUsername,
                  dateCreated: moment().format(),
                  lastSynced: moment().format(),
                },
              ],
            },
          };
        } else if (settings?.sync?.services?.door43.length === 0) {
          // first time sync - not data
          settings.sync.services.door43.push(
            {
              username: syncUsername,
              dateCreated: moment().format(),
              lastSynced: moment().format(),
            },
          );
        } else {
          // eslint-disable-next-line array-callback-return
        settings.sync?.services?.door43?.forEach((element) => {
          if (element?.username === syncUsername) {
            element.lastSynced = moment().format();
          } else {
            settings.sync.services.door43.push(
              {
                username: syncUsername,
                dateCreated: moment().format(),
                lastSynced: moment().format(),
              },
            );
          }
        });
        }

        logger.debug('SyncToGiteaUtils.js', 'Upadting the ag settings with sync data');
        await fs.writeFileSync(settingsPath, JSON.stringify(settings));
      }
    }
  } else {
    // eslint-disable-next-line no-throw-literal
    throw { message: 'unknown operation' };
  }
};
