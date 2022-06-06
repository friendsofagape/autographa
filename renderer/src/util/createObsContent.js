import moment from 'moment';
import { environment } from '../../environment';
import * as logger from '../logger';
import OBSData from '../lib/OBSData.json';
import JsonToMd from '../obsRcl/JsonToMd/JsonToMd';

const path = require('path');
const md5 = require('md5');

const bookAvailable = (list, id) => list.some((obj) => obj.id === id);

export const createObsContent = (username, project, direction, id,
  importedFiles, copyright) => {
  logger.debug('createObsContent.js', 'In OBS md content creation');

  return new Promise(async (resolve) => {
    const ingredients = {};
    const newpath = localStorage.getItem('userPath');
    const folder = path.join(newpath, 'autographa', 'users', username, 'projects', `${project.projectName}_${id}`, 'content');
    const fs = window.require('fs');

    logger.debug('createObsContent.js', 'Creating the story md files');
    // eslint-disable-next-line import/no-dynamic-require
    OBSData.forEach(async (storyJson) => {
      const currentFileName = `${storyJson.storyId}.md`;
      if (bookAvailable(importedFiles, currentFileName)) {
        logger.debug('createObsContent.js', `${currentFileName} is been Imported`);
        console.log("files in imported stories :" + currentFileName);
        const file = importedFiles.filter((obj) => (obj.id === currentFileName));
        const fs = window.require('fs');
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        fs.writeFileSync(path.join(folder, currentFileName), file[0].content, 'utf-8');
        const stats = fs.statSync(path.join(folder, currentFileName));
        ingredients[path.join('content', currentFileName)] = {
          checksum: {
            md5: md5(file[0].content),
          },
          mimeType: 'text/markdown',
          size: stats.size,
          scope: {},
        };
        // ingredients[path.join('content', currentFileName)].scope[book] = [];
      } else {
        console.log("else block no files in imported stories:" + currentFileName);
        logger.debug('createObsContent.js', 'Creating the md file using RCL fuvntion JsonToMd');
        const file = JsonToMd(storyJson, '');
        const fs = window.require('fs');
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        logger.debug('createObsContent.js', 'Writing File to the Content Directory');
        fs.writeFileSync(path.join(folder, currentFileName), file);
        const stats = fs.statSync(path.join(folder, currentFileName));
        ingredients[path.join('content', currentFileName)] = {
          checksum: {
            md5: md5(file),
          },
          mimeType: 'text/markdown',
          size: stats.size,
          scope: {},
        };
        // ingredients[path.join('content', currentFileName)].scope[book] = [];
      }
    });

    // ag setting creation
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

      resolve(ingredients);
  });
  };
