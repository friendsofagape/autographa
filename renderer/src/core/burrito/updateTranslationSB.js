import moment from 'moment';
import * as logger from '../../logger';

const path = require('path');
const md5 = require('md5');

const updateTranslationSB = (username, project) => new Promise((resolve) => {
  logger.debug('updateTranslationSB.js', 'In updateTranslationSB for updating the burrito.');
    const newpath = localStorage.getItem('userPath');
    const folder = path.join(newpath, 'autographa', 'users', username, 'projects', `${project.name}_${project.id[0]}`);
    const fs = window.require('fs');
    const sb = fs.readFileSync(path.join(folder, 'metadata.json'));
    const metadata = JSON.parse(sb);
    let updated = false;
    metadata.meta.dateCreated = moment().format();
    logger.debug('updateTranslationSB.js', 'Updating the details of ingredients.');
    Object.entries(metadata.ingredients).forEach(([key]) => {
      const usfm = fs.readFileSync(path.join(folder, key), 'utf8');
      const checksum = md5(usfm);
      const stats = fs.statSync(path.join(folder, key));
      if (metadata.ingredients[key].checksum.md5 === checksum) {
        updated = true;
      }
      metadata.ingredients[key].checksum.md5 = checksum;
      metadata.ingredients[key].size = stats.size;
    });
    if (updated === true) {
      Object.entries(metadata.identification?.primary?.ag).forEach(([key]) => {
        logger.debug('importBurrito.js', 'Fetching the key from burrito.');
        const rev = metadata.identification.primary.ag[key].revision;
        metadata.identification.primary.ag[key].revision = (parseInt(rev, 10) + 1).toString();
      });
    }
    try {
      logger.debug('updateTranslationSB.js', 'Updating the metadata.json (burrito) file.');
      fs.writeFileSync(path.join(folder, 'metadata.json'), JSON.stringify(metadata));
      resolve(true);
    } catch {
      logger.error('updateTranslationSB.js', 'Failed to update the metadata.json (burrito) file.');
      resolve(false);
    }
  });
export default updateTranslationSB;
