import moment from 'moment';
import { environment } from '../../environment';
import * as logger from '../logger';

const path = require('path');
const md5 = require('md5');

export const createAudioVersification = (
  username,
  project,
  versification,
  direction,
  id,
  copyright,
  currentBurrito,
  call,
) => {
  logger.debug('createAudioVersification.js', 'In createAudioVersification');
  const newpath = localStorage.getItem('userPath');
  const folder = path.join(newpath, 'autographa', 'users', username, 'projects', `${project.projectName}_${id}`, 'ingredients');
  const schemes = [
    { name: 'eng', file: 'eng.json' },
    { name: 'lxx', file: 'lxx.json' },
    { name: 'org', file: 'org.json' },
    { name: 'rsc', file: 'rsc.json' },
    { name: 'rso', file: 'rso.json' },
    { name: 'vul', file: 'vul.json' },
  ];
  const ingredients = {};
  return new Promise((resolve) => {
    schemes.forEach(async (scheme) => {
      if (versification.toLowerCase() === scheme.name) {
        logger.debug('createAudioVersification.js', 'Creating the files with selected scheme');
        // eslint-disable-next-line import/no-dynamic-require
        const file = require(`../lib/versification/${scheme.file}`);
        const fs = window.require('fs');
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        logger.debug('createAudioVersification.js', 'Creating versification.json file in ingredients');
        await fs.writeFileSync(path.join(folder, 'versification.json'), JSON.stringify(file));
        const stats = fs.statSync(path.join(folder, 'versification.json'));
        ingredients[path.join('ingredients', 'versification.json')] = {
          checksum: {
            md5: md5(file),
          },
          mimeType: 'application/json',
          size: stats.size,
          role: 'x-versification',
        };
        if (call === 'edit' && currentBurrito?.copyright?.shortStatements && (copyright.licence).length <= 500) {
          logger.debug('createAudioVersification.js', 'Won\'t create license.md file in ingredients and update the current shortStatements');
        } else {
          logger.debug('createAudioVersification.js', 'Creating license.md file in ingredients');
          await fs.writeFileSync(path.join(folder, 'license.md'), copyright.licence);
          const copyrightStats = fs.statSync(path.join(folder, 'license.md'));
          ingredients[path.join('ingredients', 'license.md')] = {
            checksum: {
              md5: md5(file),
            },
            mimeType: 'text/md',
            size: copyrightStats.size,
            role: 'x-licence',
          };
        }
        const settings = {
          version: environment.AG_SETTING_VERSION,
          project: {
            audioTranslation: {
              scriptDirection: direction,
              starred: call === 'edit' ? currentBurrito.project.audioTranslation.starred : false,
              versification,
              description: project.description,
              copyright: copyright.title,
              lastSeen: moment().format(),
              refResources: [],
              bookMarks: [],
            },
          },
        };
        logger.debug('createAudioVersification.js', 'Creating ag-settings.json file in ingredients');
        await fs.writeFileSync(path.join(folder, 'ag-settings.json'), JSON.stringify(settings));
        const stat = fs.statSync(path.join(folder, 'ag-settings.json'));
        ingredients[path.join('ingredients', 'ag-settings.json')] = {
          checksum: {
            md5: md5(settings),
          },
          mimeType: 'application/json',
          size: stat.size,
          role: 'x-autographa',
        };
        logger.debug('createAudioVersification.js', 'Returning the ingredients data');
        resolve(ingredients);
      }
    });
  });
};
