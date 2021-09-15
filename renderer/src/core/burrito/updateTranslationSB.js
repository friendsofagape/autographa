import moment from 'moment';

const path = require('path');
const md5 = require('md5');

const updateTranslationSB = (username, project) => new Promise((resolve) => {
    const newpath = localStorage.getItem('userPath');
    const folder = path.join(newpath, 'autographa', 'users', username, 'projects', `${project.name}_${project.id[0]}`);
    const fs = window.require('fs');
    const sb = fs.readFileSync(path.join(folder, 'metadata.json'));
    const metadata = JSON.parse(sb);
    metadata.meta.dateCreated = moment().format();
    // eslint-disable-next-line no-unused-vars
    Object.entries(metadata.ingredients).forEach(([key, value]) => {
      const usfm = fs.readFileSync(path.join(folder, key), 'utf8');
      const checksum = md5(usfm);
      const stats = fs.statSync(path.join(folder, key));
      metadata.ingredients[key].checksum.md5 = checksum;
      metadata.ingredients[key].size = stats.size;
    });
    try {
      fs.writeFileSync(path.join(folder, 'metadata.json'), JSON.stringify(metadata));
      resolve(true);
    } catch {
      resolve(false);
    }
  });
export default updateTranslationSB;
