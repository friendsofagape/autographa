import moment from 'moment';
import { environment } from '../../environment';
import * as logger from '../logger';

const path = require('path');
const md5 = require('md5');

const bookAvailable = (list, id) => list.some((obj) => obj.id === id);
export const createObsContent = (username, project, versification, direction, id,
  importedFiles, copyright, currentBurrito, call) => {
  logger.debug('createObsContent.js', 'In OBS md content creation');

  return new Promise(async (resolve) => {
  const ingredients = {};
  const newpath = localStorage.getItem('userPath');
  const folder = path.join(newpath, 'autographa', 'users', username, 'projects', `${project.projectName}_${id}`, 'content');
  const fs = window.require('fs');
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  const settings = {
    version: environment.AG_SETTING_VERSION,
    project: {
      textStories: {
        scriptDirection: direction,
        starred: false,
        description: project.description,
        copyright: copyright.title,
        lastSeen: moment().format(),
        refResources: [],
        bookMarks: [],
      },
    },
  };
  logger.debug('createObsContent.js', 'Creating ag-settings.json file in content');
  await fs.writeFileSync(path.join(folder, 'ag-settings.json'), JSON.stringify(settings));
  const stat = fs.statSync(path.join(folder, 'ag-settings.json'));
  ingredients[path.join('content', 'ag-settings.json')] = {
    checksum: {
      md5: md5(settings),
    },
    mimeType: 'application/json',
    size: stat.size,
    role: 'x-autographa',
  };

  ingredients.content = {
        mimeType: 'text/markdown',
        checksum: {
          md5: '39e81428079f566e96a10827b1f57df5',
        },
        size: 4398,
        scope: {
          GEN: ['1-2'],
        },
  };
    resolve(ingredients);
  });
  };
