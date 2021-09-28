import moment from 'moment';
import * as logger from '../../logger';

const path = require('path');
const md5 = require('md5');

const updateTranslationSB = (username, project) => new Promise((resolve) => {
    const newpath = localStorage.getItem('userPath');
    const folder = path.join(newpath, 'autographa', 'users', username, 'projects', `${project.name}_${project.id[0]}`);
    const fs = window.require('fs');
    const sb = fs.readFileSync(path.join(folder, 'metadata.json'));
    const metadata = JSON.parse(sb);
    // eslint-disable-next-line no-unused-vars
    let updated = false;
    metadata.meta.dateCreated = moment().format();
    // eslint-disable-next-line no-unused-vars
    Object.entries(metadata.ingredients).forEach(([key, value]) => {
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
      fs.writeFileSync(path.join(folder, 'metadata.json'), JSON.stringify(metadata));
      resolve(true);
    } catch {
      resolve(false);
    }
  });
export default updateTranslationSB;
