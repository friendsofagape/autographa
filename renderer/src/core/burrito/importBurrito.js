/* eslint-disable max-len */
import moment from 'moment';
import { v5 as uuidv5 } from 'uuid';
import { environment } from '../../../environment';
import * as logger from '../../logger';
import { validate } from '../../util/validate';
import { updateVersion } from './updateTranslationSB';

const md5 = require('md5');

const fs = window.require('fs');
const path = require('path');

export const checkDuplicate = async (metadata, currentUser, resource) => {
  logger.debug('importBurrito.js', 'In checkDuplicate');
  const projectName = metadata.identification?.name?.en;
  let existingProject;
  let id;
  const newpath = localStorage.getItem('userPath');
  const projectDir = path.join(newpath, 'autographa', 'users', currentUser, resource);
  const folderList = fs.readdirSync(projectDir);
  logger.debug('importBurrito.js', 'Checking for AG key in burrito');
  if (metadata.identification.primary.ag !== undefined) {
    Object.entries(metadata.identification?.primary?.ag).forEach(([key]) => {
      logger.debug('importBurrito.js', 'Fetching the key from Primary.');
      id = key;
    });
  } else if (metadata.identification.upstream.ag !== undefined) {
    const list = metadata.identification?.upstream?.ag;
    logger.debug('importBurrito.js', 'Fetching the latest key from upstream list.');
    const latest = list.reduce((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? a : b));
    Object.entries(latest).forEach(([key]) => {
      logger.debug('importBurrito.js', 'Fetching the latest key from upstream.');
      id = key;
    });
  }
  if (id && projectName) {
    await folderList.forEach((folder) => {
      if (folder === `${projectName}_${id}`) {
        logger.debug('importBurrito.js', 'Project already exists.');
        existingProject = true;
      }
    });
  }
  if (existingProject === true) {
    logger.debug('importBurrito.js', 'Project already exists.');
  } else {
    logger.debug('importBurrito.js', 'This is a New Project.');
  }
  return existingProject;
};
export const viewBurrito = async (filePath, currentUser, resource) => {
  logger.debug('importBurrito.js', 'Inside viewBurrito');
  const result = {};
  if (fs.existsSync(path.join(filePath, 'metadata.json'))) {
    logger.debug('importBurrito.js', 'Project has Burrito file metadata.json.');
    result.fileExist = true;
    let sb = fs.readFileSync(path.join(filePath, 'metadata.json'));
    const metadata = JSON.parse(sb);
    // Fixing the issue of previous version of AG. The dateCreated was left empty and it will fail the validation.
    if (!metadata?.meta?.dateCreated) {
      const agId = Object.keys(metadata?.identification?.primary?.ag);
      metadata.meta.dateCreated = metadata?.identification?.primary?.ag[agId[0]].timestamp;
      sb = JSON.stringify(metadata);
    }
    const success = await validate('metadata', path.join(filePath, 'metadata.json'), sb, metadata.meta.version);
    if (success) {
      result.validate = true;
      logger.debug('importBurrito.js', 'Burrito file validated successfully');
      result.projectName = metadata.identification?.name?.en;
      result.version = metadata.meta.version;
      result.burritoType = `${metadata.type?.flavorType?.name} / ${metadata.type?.flavorType?.flavor?.name}`;
      result.ingredients = Object.keys(metadata.ingredients).map((key) => key);
      result.primaryKey = metadata.identification.primary;
      result.publicDomain = metadata.copyright?.publicDomain;
      result.language = metadata.languages.map((lang) => lang.name.en);
      const duplicate = await checkDuplicate(metadata, currentUser, resource);
      result.duplicate = duplicate;
    } else {
      result.validate = false;
      if (metadata.meta.version < '0.3.0') {
        result.version = metadata.meta.version;
        logger.error('importBurrito.js', `Expected burrito version 0.3.0 or more instead of ${metadata.meta.version}`);
      } else {
        logger.error('importBurrito.js', 'Invalid burrito file (metadata.json).');
      }
    }
  } else {
    logger.warn('importBurrito.js', 'Unable to find burrito file (metadata.json).');
    result.fileExist = false;
  }
  return result;
};
const importBurrito = async (filePath, currentUser, updateBurritoVersion) => {
  logger.debug('importBurrito.js', 'Inside importBurrito');
  const fse = window.require('fs-extra');
  const status = [];
  const newpath = localStorage.getItem('userPath');
  const projectDir = path.join(newpath, 'autographa', 'users', currentUser, 'projects');
  fs.mkdirSync(projectDir, { recursive: true });
  // Importing the project
  if (fs.existsSync(path.join(filePath, 'metadata.json'))) {
    logger.debug('importBurrito.js', 'Project has Burrito file metadata.json.');
    let sb = fs.readFileSync(path.join(filePath, 'metadata.json'));
    let metadata = JSON.parse(sb);
    // Fixing the issue of previous version of AG. The dateCreated was left empty and it will fail the validation.
    if (!metadata?.meta?.dateCreated) {
      const agId = Object.keys(metadata?.identification?.primary?.ag);
      metadata.meta.dateCreated = metadata?.identification?.primary?.ag[agId[0]].timestamp;
      sb = JSON.stringify(metadata);
    }
    const success = validate('metadata', path.join(filePath, 'metadata.json'), sb, metadata.meta.version);
    if (success) {
      logger.debug('importBurrito.js', 'Burrito file validated successfully');
      let projectName = metadata.identification?.name?.en;
      let id;
      logger.debug('importBurrito.js', 'Checking for AG primary key');
      if (metadata.identification.primary.ag !== undefined) {
        Object.entries(metadata.identification?.primary?.ag).forEach(([key]) => {
          logger.debug('importBurrito.js', 'Fetching the key from burrito.');
          id = key;
        });
      } else if (metadata.identification.upstream.ag !== undefined) {
        Object.entries(metadata.identification.primary).forEach(([key]) => {
          logger.debug('importBurrito.js', 'Swapping data between primary and upstream');
          const identity = metadata.identification.primary[key];
          metadata.identification.upstream[key] = [identity];
          delete metadata.identification.primary[key];
          delete metadata.idAuthorities;
        });
        metadata.idAuthorities = {
          ag: {
            id: 'http://www.autographa.org',
            name: {
              en: 'Autographa application',
            },
          },
        };
        const list = metadata.identification?.upstream?.ag;
        logger.debug('importBurrito.js', 'Fetching the latest key from list.');
        // eslint-disable-next-line max-len
        const latest = list.reduce((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? a : b));
        Object.entries(latest).forEach(([key]) => {
          logger.debug('importBurrito.js', 'Fetching the latest key from burrito.');
          id = key;
        });
        if (list.length > 1) {
          (metadata.identification.upstream.ag).forEach((e, i) => {
            if (e === latest) {
              (metadata.identification?.upstream?.ag).splice(i, 1);
            }
          });
        } else {
          delete metadata.identification?.upstream?.ag;
        }
        metadata.identification.primary.ag = latest;
      }

      if (!id) {
        Object.entries(metadata.identification.primary).forEach(([key]) => {
          logger.debug('importBurrito.js', 'Swapping data between primary and upstream');
          if (key !== 'ag') {
            const identity = metadata.identification.primary[key];
            metadata.identification.upstream[key] = [identity];
            delete metadata.identification.primary[key];
          }
        });
        logger.debug('importBurrito.js', 'Creating a new key.');
        const key = currentUser + metadata.identification.name.en + moment().format();
        id = uuidv5(key, environment.uuidToken);
        metadata.identification.primary.ag = {
          [id]: {
          revision: '0',
          timestamp: moment().format(),
          },
        };
      }
      if (!projectName) {
        logger.debug('importBurrito.js', 'Taking folder name as Project Name');
        // path.basename is not working for windows
        // projectName = path.basename(filePath);
        projectName = (filePath.split(/[(\\)?(/)?]/gm)).pop();
      }

      fs.mkdirSync(path.join(projectDir, `${projectName}_${id}`, 'ingredients'), { recursive: true });
      logger.debug('importBurrito.js', 'Creating a directory if not exists.');
      await fse.copy(filePath, path.join(projectDir, `${projectName}_${id}`))
      .then(() => {
        Object.entries(metadata.ingredients).forEach(([key, value]) => {
          logger.debug('importBurrito.js', 'Fetching keys from ingredients.');
          const content = fs.readFileSync(path.join(projectDir, `${projectName}_${id}`, key), 'utf8');
          const checksum = md5(content);
          if (checksum !== value.checksum.md5) {
            logger.debug('importBurrito.js', 'Updating the checksum.');
          }
          const stats = fs.statSync(path.join(filePath, key));
          if (stats.size !== value.size) {
            logger.debug('importBurrito.js', 'Updating the size.');
          }
          metadata.ingredients[key].checksum.md5 = checksum;
          metadata.ingredients[key].size = stats.size;
        });
      })
      .catch((err) => logger.error('importBurrito.js', `${err}`));

      metadata.meta.generator.userName = currentUser;
      if (!fs.existsSync(path.join(filePath, 'ingredients', 'ag-settings.json'))) {
        logger.debug('importBurrito.js', 'Creating ag-settings.json file');
        const settings = {
          version: environment.AG_SETTING_VERSION,
          project: {
            textTranslation: {
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
        logger.debug('importBurrito.js', 'Creating the ag-settings.json file.');
        await fs.writeFileSync(path.join(projectDir, `${projectName}_${id}`, 'ingredients', 'ag-settings.json'), JSON.stringify(settings));
        const stat = fs.statSync(path.join(projectDir, `${projectName}_${id}`, 'ingredients', 'ag-settings.json'));
        metadata.ingredients[path.join('ingredients', 'ag-settings.json')] = {
          checksum: {
            md5: md5(settings),
          },
          mimeType: 'application/json',
          size: stat.size,
          role: 'x-autographa',
        };
      } else {
        logger.debug('importBurrito.js', 'Updating ag-settings.json file');
        const ag = fs.readFileSync(path.join(projectDir, `${projectName}_${id}`, 'ingredients', 'ag-settings.json'));
        let settings = JSON.parse(ag);
        if (settings.version !== environment.AG_SETTING_VERSION) {
          // eslint-disable-next-line prefer-const
          let setting = settings;
          setting.version = environment.AG_SETTING_VERSION;
          setting.project.textTranslation.scriptDirection = settings.project.textTranslation?.scriptDirection ? settings.project.textTranslation?.scriptDirection : '';
          setting.project.textTranslation.starred = settings.project.textTranslation?.starred ? settings.project.textTranslation?.starred : false;
          setting.project.textTranslation.versification = settings.project.textTranslation?.versification ? settings.project.textTranslation?.versification : 'ENG';
          setting.project.textTranslation.description = settings.project.textTranslation?.description ? settings.project.textTranslation?.description : '';
          setting.project.textTranslation.copyright = settings.project.textTranslation?.copyright ? settings.project.textTranslation?.copyright : { title: 'Custom' };
          setting.project.textTranslation.refResources = settings.project.textTranslation?.refResources ? settings.project.textTranslation?.refResources : [];
          setting.project.textTranslation.bookMarks = settings.project.textTranslation?.bookMarks ? settings.project.textTranslation?.bookMarks : [];
          settings = setting;
        }
        settings.project.textTranslation.lastSeen = moment().format();
        await fs.writeFileSync(path.join(projectDir, `${projectName}_${id}`, 'ingredients', 'ag-settings.json'), JSON.stringify(settings));
      }
      if (metadata.copyright.fullStatementPlain) {
        const newLicence1 = (metadata.copyright.fullStatementPlain.en).replace(/\\n/gm, '\n');
        const newLicence = newLicence1?.replace(/\\r/gm, '\r');
        const licence = newLicence?.replace(/'/gm, '"');
        await fs.writeFileSync(path.join(projectDir, `${projectName}_${id}`, 'ingredients', 'license.md'), licence);
        const copyrightStats = fs.statSync(path.join(projectDir, `${projectName}_${id}`, 'ingredients', 'license.md'));
        metadata.copyright.licenses = [{ ingredient: 'license.md' }];
        metadata.ingredients[path.join('ingredients', 'license.md')] = {
          checksum: {
            md5: md5(metadata.copyright.fullStatementPlain.en),
          },
          mimeType: 'text/md',
          size: copyrightStats.size,
          role: 'x-licence',
        };
        delete metadata.copyright.fullStatementPlain;
        delete metadata.copyright.publicDomain;
      }
      if (updateBurritoVersion) {
        logger.debug('importBurrito.js', 'Updating the burrito version');
        metadata = updateVersion(metadata);
      }
      await fs.writeFileSync(path.join(projectDir, `${projectName}_${id}`, 'metadata.json'), JSON.stringify(metadata));
      logger.debug('importBurrito.js', 'Creating the metadata.json Burrito file.');
      status.push({ type: 'success', value: 'Project Imported Successfully' });
    } else {
      logger.error('importBurrito.js', 'Invalid burrito file (metadata.json).');
      status.push({ type: 'error', value: 'Invalid burrito file (metadata.json).' });
    }
  } else {
    logger.warn('importBurrito.js', 'Unable to find burrito file (metadata.json).');
    status.push({ type: 'error', value: 'Unable to find burrito file (metadata.json).' });
  }
  return status;
};
export default importBurrito;
