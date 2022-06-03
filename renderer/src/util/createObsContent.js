import moment from 'moment';
import { environment } from '../../environment';
import * as logger from '../logger';

const path = require('path');
const md5 = require('md5');

const bookAvailable = (list, id) => list.some((obj) => obj.id === id);
export const createObsContent = (username, project, versification, books, direction, id,
  importedFiles, copyright, currentBurrito, call) => {
  logger.debug('createObsContent.js', 'In OBS md content creation');
  const newpath = localStorage.getItem('userPath');
  const folder = path.join(newpath, 'autographa', 'users', username, 'projects', `${project.projectName}_${id}`, 'ingredients');
  
  const ingredients = {
      content: {
        mimeType: 'text/markdown',
        checksum: {
          md5: '39e81428079f566e96a10827b1f57df5'
        },
        size: 4398,
        scope: {
          GEN: ['1-2']
        }
      }
  };
  return new Promise((resolve) => {
    resolve(ingredients);
    });
  };
