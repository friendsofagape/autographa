/* eslint-disable no-alert */
import moment from 'moment';
import { environment } from '../../../environment';
import * as logger from '../../logger';

const md5 = require('md5');

const importBurrito = async (filePath) => {
  logger.debug('importBurrito.js', 'Inside importBurrito');
  const fs = window.require('fs');
  const path = require('path');
  const currentUser = 'new';
  const status = [];
  const newpath = localStorage.getItem('userPath');
  const projectDir = path.join(newpath, 'autographa', 'users', currentUser, 'projects');
  fs.mkdirSync(projectDir, { recursive: true });
  // Importing the project
  if (fs.existsSync(path.join(filePath, 'metadata.json'))) {
    logger.debug('importBurrito.js', 'Project has Burrito file metadata.json.');
    const sb = fs.readFileSync(path.join(filePath, 'metadata.json'));
    const metadata = JSON.parse(sb);
    let projectName;
    let existingProject;
    const folderList = fs.readdirSync(projectDir);
    await folderList.forEach((folder) => {
      if (folder === metadata.identification.name.en) {
        existingProject = true;
      }
    });
    if (existingProject === true) {
      logger.debug('importBurrito.js', 'Project already exists.');
      alert('Existing project');
      projectName = `${metadata.identification.name.en}_copy`;
    } else {
      logger.debug('importBurrito.js', 'This is a New Project.');
      projectName = metadata.identification.name.en;
    }
    fs.mkdirSync(path.join(projectDir, projectName, 'ingredients'), { recursive: true });
    // Looping ingredients
    Object.entries(metadata.ingredients).forEach(([key, value]) => {
        // Check the canonType of the burritos
        // Object.entries(metadata.type.flavorType.currentScope).forEach(([scope, v]) => {
        //   console.log(scope, value.scope);
        // });
        // if (Object.getOwnPropertyNames(value.scope) in (metadata.type.flavorType.currentScope)) {
      const content = fs.readFileSync(path.join(filePath, key), 'utf8');
      const regex = /ingredients[(/)?(\\)?](.*)\.(.*)/gm;
      const subst = '$1';
      const result = key.replace(regex, subst);
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
      if (key.includes('.usfm')) {
        fs.writeFileSync(path.join(projectDir, projectName, 'ingredients', `${result}.usfm`), content);
        logger.debug('importBurrito.js', `${result}.usfm created.`);
      } else {
        fs.writeFileSync(path.join(projectDir, projectName, 'ingredients', `${result}.json`), content);
        logger.debug('importBurrito.js', `${result}.json created.`);
      }
    });
    metadata.meta.username = currentUser;
    metadata.identification.name.en = projectName;
    if (!fs.existsSync(path.join(filePath, 'ingredients', 'ag-settings.json'))) {
      const settings = {
        version: environment.AG_SETTING_VERSION,
        project: {
          textTranslation: {
            scriptDirection: 'LTR',
            starred: false,
            description: '',
            lastSeen: moment().format(),
            bibleVersion: '',
            abbreviation: '',
            refResources: [],
          },
        },
      };
      logger.debug('importBurrito.js', 'Creating the ag-settings.json file.');
      await fs.writeFileSync(path.join(projectDir, projectName, 'ingredients', 'ag-settings.json'), JSON.stringify(settings));
      const stat = fs.statSync(path.join(projectDir, projectName, 'ingredients', 'ag-settings.json'));
      metadata.ingredients[path.join('ingredients', 'ag-settings.json')] = {
        checksum: {
          md5: md5(settings),
        },
        mimeType: 'application/json',
        size: stat.size,
        role: 'x-autographa',
      };
    }
    await fs.writeFileSync(path.join(projectDir, projectName, 'metadata.json'), JSON.stringify(metadata));
    logger.debug('importBurrito.js', 'Creating the metadata.json Burrito file.');
    status.push({ type: 'success', value: 'Project Imported' });
  } else {
    logger.debug('importBurrito.js', 'Unable to find burrito file (metadata.json).');
    status.push({ type: 'error', value: 'Unable to find burrito file (metadata.json).' });
  }
  return status;
};
export default importBurrito;
