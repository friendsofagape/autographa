/* eslint-disable */
import moment from 'moment';
import { v5 as uuidv5 } from 'uuid';
import { updateVersion } from '@/core/burrito/updateTranslationSB';
import * as localForage from 'localforage';
import {
    readContent, createRepository,createContent, updateContent,
  } from 'gitea-react-toolkit';
import * as logger from '../../../logger';
import { environment } from '../../../../environment';

const md5 = require('md5');
const path = require('path');

// import gitea project to local
export const importServerProject = async (updateBurrito, repo, sbData, auth, userBranch, action, ignoreFilesPaths=[]) => {
    logger.debug('GiteaUtils.js', 'Inside Import Project');
    // console.log('inside server project import');
    await localForage.getItem('userProfile').then(async (user) => {
    const currentUser = user.username;
    const fs = window.require('fs');
    const newpath = localStorage.getItem('userPath');
    let sbDataObject = sbData;
    console.log("sbdataObje : ", sbDataObject);
    const projectDir = path.join(newpath, 'autographa', 'users', currentUser, 'projects');
    fs.mkdirSync(projectDir, { recursive: true });
    if (!sbData?.meta?.dateCreated) {
        const agId = Object.keys(sbDataObject?.identification?.primary?.ag);
        sbDataObject.meta.dateCreated = sbDataObject?.identification?.primary?.ag[agId[0]].timestamp;
    }
    let projectName = sbDataObject.identification?.name?.en;
    let id;
    logger.debug('dropzone giteaUtils import.js', 'Checking for AG primary key');
    if (sbDataObject.identification.primary.ag !== undefined) {
        Object.entries(sbDataObject.identification?.primary?.ag).forEach(([key]) => {
        logger.debug('dropzone giteaUtils import.js', 'Fetching the key from burrito.');
        id = key;
        });
    } else if (sbDataObject.identification.upstream.ag !== undefined) {
        Object.entries(sbDataObject.identification.primary).forEach(([key]) => {
        logger.debug('dropzone giteaUtils import.js', 'Swapping data between primary and upstream');
        const identity = sbDataObject.identification.primary[key];
        sbDataObject.identification.upstream[key] = [identity];
        delete sbDataObject.identification.primary[key];
        delete sbDataObject.idAuthorities;
        });
        sbDataObject.idAuthorities = {
        ag: {
            id: 'http://www.autographa.org',
            name: {
            en: 'Autographa application',
            },
        },
        };
        const list = sbDataObject.identification?.upstream?.ag;
        logger.debug('dropzone giteaUtils import.js', 'Fetching the latest key from list.');
        // eslint-disable-next-line max-len
        const latest = list.reduce((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? a : b));
        Object.entries(latest).forEach(([key]) => {
        logger.debug('dropzone giteaUtils import.js', 'Fetching the latest key from burrito.');
        id = key;
        });
        if (list.length > 1) {
        (sbDataObject.identification.upstream.ag).forEach((e, i) => {
            if (e === latest) {
            (sbDataObject.identification?.upstream?.ag)?.splice(i, 1);
            }
        });
        } else {
        delete sbDataObject.identification?.upstream?.ag;
        }
        sbDataObject.identification.primary.ag = latest;
    }

    if (!id) {
        Object.entries(sbDataObject.identification.primary).forEach(([key]) => {
        logger.debug('dropzone giteaUtils import.js', 'Swapping data between primary and upstream');
        if (key !== 'ag') {
            const identity = sbDataObject.identification.primary[key];
            sbDataObject.identification.upstream[key] = [identity];
            delete sbDataObject.identification.primary[key];
        }
        });
        logger.debug('dropzone giteaUtils import.js', 'Creating a new key.');
        const key = currentUser + sbDataObject.identification.name.en + moment().format();
        id = uuidv5(key, environment.uuidToken);
        sbDataObject.identification.primary.ag = {
        [id]: {
        revision: '0',
        timestamp: moment().format(),
        },
        };
    }
    if (!projectName) {
        logger.debug('dropzone giteaUtils import.js', 'Taking folder name as Project Name');
        projectName = ((repo.name.split('-').pop()).replace(new RegExp('_', 'g'), ' '));
    }
    const firstKey = Object.keys(sbDataObject.ingredients)[0];
    const folderName = firstKey.split(/[(\\)?(/)?]/gm).slice(0);
    const dirName = folderName[0];
    fs.mkdirSync(path.join(projectDir, `${projectName}_${id}`, dirName), { recursive: true });
    logger.debug('dropzone giteaUtils import.js', 'Creating a directory if not exists.');

    // fetch and add ingredients
    action?.setUploadstart(true);
    for (const key in sbDataObject.ingredients) {
        action?.setTotalUploaded((prev) => prev + 1);
        // console.log(key);
        if (!ignoreFilesPaths.includes(key)) {
        await readContent(
            {
              config: auth.config,
              owner: auth.user.login,
              repo: repo.name,
              ref: userBranch?.name,
              filepath: key,
            },
          ).then(async (result) => {
            logger.debug('giteaUtils import.js', 'sending the data from Gitea with content');
            // console.log('file from server : ', result.name);
            if (result !== null) {
              await fetch(result.download_url)
                  .then((resposne) => resposne.text())
                  .then(async (ingredient) => {
                  try {
                      await fs.writeFileSync(path.join(projectDir, `${projectName}_${id}`, key), ingredient);
                      logger.debug('giteaUtils import.js', `Write File success ${key}`);
                    } catch (err) {
                      logger.debug('dropzone giteaUtils import.js', `Error write file ${key} : `, err);
                      console.error(err);
                    }
              });
            } else {
              logger.debug('dropzone giteaUtils import.js', `Error in read ${key} from Server `);
            }
          });
        }
      }
    // check md5 values
    Object.entries(sbDataObject.ingredients).forEach(([key, value]) => {
        logger.debug('dropzone giteaUtils import.js', 'Fetching keys from ingredients.');
        const content = fs.readFileSync(path.join(projectDir, `${projectName}_${id}`, key), 'utf8');
        const checksum = md5(content);
        if (checksum !== value.checksum.md5) {
            logger.debug('dropzone giteaUtils import.js', 'Updating the checksum.');
        }
        const stats = fs.statSync(path.join(projectDir, `${projectName}_${id}`, key));
        if (stats.size !== value.size) {
            logger.debug('dropzone giteaUtils import.js', 'Updating the size.');
        }
        sbDataObject.ingredients[key].checksum.md5 = checksum;
        sbDataObject.ingredients[key].size = stats.size;
      });
    // ag settings file
    sbDataObject.meta.generator.userName = currentUser;
      if (!fs.existsSync(path.join(projectDir, `${projectName}_${id}`, dirName, 'ag-settings.json'))) {
        logger.debug('dropzone giteaUtils import.js', 'Creating ag-settings.json file');
        const settings = {
          version: environment.AG_SETTING_VERSION,
          project: {
            [sbDataObject.type.flavorType.flavor.name]: {
              scriptDirection: 'LTR',
              starred: false,
              isArchived: false,
              versification: '',
              description: '',
              copyright: '',
              lastSeen: moment().format(),
              refResources: [],
              bookMarks: [],
            },
          },
          sync : { services: { door43 : [] } },
        };
        logger.debug('dropzone giteaUtils import.js', 'Creating the ag-settings.json file.');
        await fs.writeFileSync(path.join(projectDir, `${projectName}_${id}`, dirName, 'ag-settings.json'), JSON.stringify(settings));
        const stat = fs.statSync(path.join(projectDir, `${projectName}_${id}`, dirName, 'ag-settings.json'));
        sbDataObject.ingredients[path.join(dirName, 'ag-settings.json')] = {
          checksum: {
            md5: md5(settings),
          },
          mimeType: 'application/json',
          size: stat.size,
          role: 'x-autographa',
        };
      } else {
        logger.debug('dropzone giteaUtils import.js', 'Updating ag-settings.json file');
        const ag = fs.readFileSync(path.join(projectDir, `${projectName}_${id}`, dirName, 'ag-settings.json'));
        let settings = JSON.parse(ag);
        if (settings.version !== environment.AG_SETTING_VERSION) {
          // eslint-disable-next-line prefer-const
          let setting = settings;
          setting.version = environment.AG_SETTING_VERSION;
          setting.project[sbDataObject.type.flavorType.flavor.name].scriptDirection = settings.project[sbDataObject.type.flavorType.flavor.name]?.scriptDirection ? settings.project[sbDataObject.type.flavorType.flavor.name]?.scriptDirection : '';
          setting.project[sbDataObject.type.flavorType.flavor.name].starred = settings.project[sbDataObject.type.flavorType.flavor.name]?.starred ? settings.project[sbDataObject.type.flavorType.flavor.name]?.starred : false;
          setting.project[sbDataObject.type.flavorType.flavor.name].isArchived = settings.project[sbDataObject.type.flavorType.flavor.name]?.isArchived ? settings.project[sbDataObject.type.flavorType.flavor.name]?.isArchived : false;
          setting.project[sbDataObject.type.flavorType.flavor.name].versification = settings.project[sbDataObject.type.flavorType.flavor.name]?.versification ? settings.project[sbDataObject.type.flavorType.flavor.name]?.versification : 'ENG';
          setting.project[sbDataObject.type.flavorType.flavor.name].description = settings.project[sbDataObject.type.flavorType.flavor.name]?.description ? settings.project[sbDataObject.type.flavorType.flavor.name]?.description : '';
          setting.project[sbDataObject.type.flavorType.flavor.name].copyright = settings.project[sbDataObject.type.flavorType.flavor.name]?.copyright ? settings.project[sbDataObject.type.flavorType.flavor.name]?.copyright : { title: 'Custom' };
          setting.project[sbDataObject.type.flavorType.flavor.name].refResources = settings.project[sbDataObject.type.flavorType.flavor.name]?.refResources ? settings.project[sbDataObject.type.flavorType.flavor.name]?.refResources : [];
          setting.project[sbDataObject.type.flavorType.flavor.name].bookMarks = settings.project[sbDataObject.type.flavorType.flavor.name]?.bookMarks ? settings.project[sbDataObject.type.flavorType.flavor.name]?.bookMarks : [];
          setting.sync.services.door43 = setting?.sync?.services?.door43 ? setting?.sync?.services?.door43 : [];
          settings = setting;
        }
        settings.project[sbDataObject.type.flavorType.flavor.name].lastSeen = moment().format();
        await fs.writeFileSync(path.join(projectDir, `${projectName}_${id}`, dirName, 'ag-settings.json'), JSON.stringify(settings));
      }
      if (sbDataObject.copyright.fullStatementPlain) {
        const newLicence1 = (sbDataObject.copyright.fullStatementPlain.en).replace(/\\n/gm, '\n');
        const newLicence = newLicence1?.replace(/\\r/gm, '\r');
        const licence = newLicence?.replace(/'/gm, '"');
        await fs.writeFileSync(path.join(projectDir, `${projectName}_${id}`, dirName, 'license.md'), licence);
        const copyrightStats = fs.statSync(path.join(projectDir, `${projectName}_${id}`, dirName, 'license.md'));
        sbDataObject.copyright.licenses = [{ ingredient: 'license.md' }];
        sbDataObject.ingredients[path.join(dirName, 'license.md')] = {
          checksum: {
            md5: md5(sbDataObject.copyright.fullStatementPlain.en),
          },
          mimeType: 'text/md',
          size: copyrightStats.size,
          role: 'x-licence',
        };
        delete sbDataObject.copyright.fullStatementPlain;
        delete sbDataObject.copyright.publicDomain;
      }
    //   burrito update
    if (updateBurrito) {
        logger.debug('importBurrito.js', 'Updating the burrito version');
        sbDataObject = updateVersion(sbDataObject);
    }
    await fs.writeFileSync(path.join(projectDir, `${projectName}_${id}`, 'metadata.json'), JSON.stringify(sbDataObject));
    logger.debug('importBurrito.js', 'Creating the metadata.json Burrito file.');
    action?.setUploadstart(false);
    console.log('finished import project');
    });
};

// sync profile updation
export const createSyncProfile = async (auth) => {
  // console.log("use Effect called auth changes : ", auth);
  const fs = window.require('fs');
  const path = require('path');
  await localForage.getItem('userProfile').then((user) => {
    const currentUser = user?.username;
    const newpath = localStorage.getItem('userPath');
    const file = path.join(newpath, 'autographa', 'users', currentUser, 'ag-user-settings.json');
    if (fs.existsSync(file)) {
      fs.readFile(file, (err, data) => {
        if (err) {
          logger.error('GiteaFileBrowser.js', 'Failed to read the data from file');
        } else {
        logger.debug('GiteaFileBrowser.js', 'Successfully read the data from file');
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
        // add token to file on login
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
        fs.writeFileSync(file, JSON.stringify(json));
      }
      });
    }
  });
};

// create repo for new project sync
export const handleCreateRepo = async (repoName, auth, description) => {
  const settings = {
    name: repoName,
    description: description || `${repoName}`,
    private: false,
  };
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
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
      reject(err);
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
    branch: branch,
    filepath: filePath,
    content: fileContent,
    message: `commit ${filePath}`,
    author: {
      email: auth.user.email,
      username: auth.user.username,
    },
  }).then(() => {
    logger.debug('Dropzone.js', `file uploaded to Gitea ${filePath}`);
    // console.log('RESPONSE :', res);
  })
  .catch((err) => {
    logger.debug('Dropzone.js', `failed to upload file to Gitea ${filePath} ${err}`);
    console.log(filePath, ' : error : ', err);
    throw {error : err};
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
    if (result === null){
      throw 'can not read repo'
    }
    await updateContent({
      config: auth.config,
      owner: auth.user.login,
      repo: repoName.toLowerCase(),
      branch: branch,
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

// upload project to a branch on exsting repo
export const uploadProjectToBranchRepoExist = async ({repo, userProjectBranch, metaDataSbRemote, agUsername, auth, ignoreFilesPaths=[]}) => {
  // console.log('in replace existing upload func----', repo, userProjectBranch, metaDataSbRemote, agUsername, auth);
  logger.debug('giteaUitils.js', 'Upload project to tempory branch for merge');
  try {
    const newpath = localStorage.getItem('userPath');
    const fs = window.require('fs');
    const path = require('path');
    const projectId = Object.keys(metaDataSbRemote.identification.primary.ag)[0];
    const projectName = metaDataSbRemote.identification.name.en;
    // const projectCreated = metaDataSbRemote.meta.dateCreated.split('T')[0];
    const projectsMetaPath = path.join(newpath, 'autographa', 'users', agUsername, 'projects', `${projectName}_${projectId}`);
    const MetadataLocal = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
    const localSB = JSON.parse(MetadataLocal);
    if (!ignoreFilesPaths.includes('metadata.json')) {
      await createFiletoServer(JSON.stringify(MetadataLocal), 'metadata.json', `${userProjectBranch.name}-merge`, repo.name, auth)
    }
    const ingredientsObj = localSB.ingredients;
    for (const key in ingredientsObj) {
      if (Object.prototype.hasOwnProperty.call(ingredientsObj, key)) {
        if (!ignoreFilesPaths.includes(key)){
          const metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
          await createFiletoServer(metadata1, key, `${userProjectBranch.name}-merge`, repo.name, auth);
        }
      }
    }
    logger.debug('giteaUitils.js', 'Upload project to tempory branch for merge finished');
  }
  catch(data){
    logger.debug('giteaUitils.js', 'Upload project to tempory branch for merge Error' , err);
    throw data;
  };
}