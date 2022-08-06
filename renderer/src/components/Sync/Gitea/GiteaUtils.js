/* eslint-disable */ 
import moment from 'moment';
import { v5 as uuidv5 } from 'uuid';
import { updateVersion } from '@/core/burrito/updateTranslationSB';
import * as localForage from 'localforage';
import {
    readContent,
  } from 'gitea-react-toolkit';
import * as logger from '../../../logger';
import { environment } from '../../../../environment';

const md5 = require('md5');
const path = require('path');

export const importServerProject = async (updateBurrito, repo, sbData, auth, userBranch) => {
    logger.debug('GiteaUtils.js', 'Inside Import Project');
    // console.log('inside server project import');

    await localForage.getItem('userProfile').then(async (user) => {
    const currentUser = user.username;
    const fs = window.require('fs');
    const newpath = localStorage.getItem('userPath');
    let sbDataObject = sbData;
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
    for (const key in sbDataObject.ingredients) {
        console.log(sbDataObject);
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
            console.log('file from server : ', result.name);
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
          });
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
              versification: '',
              description: '',
              copyright: '',
              lastSeen: moment().format(),
              refResources: [],
              bookMarks: [],
            },
          },
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
          setting.project[sbDataObject.type.flavorType.flavor.name].versification = settings.project[sbDataObject.type.flavorType.flavor.name]?.versification ? settings.project[sbDataObject.type.flavorType.flavor.name]?.versification : 'ENG';
          setting.project[sbDataObject.type.flavorType.flavor.name].description = settings.project[sbDataObject.type.flavorType.flavor.name]?.description ? settings.project[sbDataObject.type.flavorType.flavor.name]?.description : '';
          setting.project[sbDataObject.type.flavorType.flavor.name].copyright = settings.project[sbDataObject.type.flavorType.flavor.name]?.copyright ? settings.project[sbDataObject.type.flavorType.flavor.name]?.copyright : { title: 'Custom' };
          setting.project[sbDataObject.type.flavorType.flavor.name].refResources = settings.project[sbDataObject.type.flavorType.flavor.name]?.refResources ? settings.project[sbDataObject.type.flavorType.flavor.name]?.refResources : [];
          setting.project[sbDataObject.type.flavorType.flavor.name].bookMarks = settings.project[sbDataObject.type.flavorType.flavor.name]?.bookMarks ? settings.project[sbDataObject.type.flavorType.flavor.name]?.bookMarks : [];
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
    // console.log('finished import project');
    });
};
