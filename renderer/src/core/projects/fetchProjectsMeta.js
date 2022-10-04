import * as logger from '../../logger';

const fetchProjectsMeta = async ({ currentUser }) => {
  logger.debug('fetchProjectsMeta.js', 'In fetchProjectsMeta');
  const newpath = localStorage.getItem('userPath');
  const fs = window.require('fs');
  const path = require('path');
  const projectsMetaPath = path.join(newpath, 'autographa', 'users', currentUser, 'projects');
  fs.mkdirSync(projectsMetaPath, { recursive: true });
  const arrayItems = fs.readdirSync(projectsMetaPath);
  const burritos = [];
  return new Promise((resolve) => {
    arrayItems.forEach((dir) => {
      const stat = fs.lstatSync(path.join(projectsMetaPath, dir));
      if (stat.isDirectory() && fs.existsSync(path.join(projectsMetaPath, dir, 'metadata.json'))) {
        logger.debug('fetchProjectsMeta.js', 'Found burrito for the project');
        const data = fs.readFileSync(path.join(projectsMetaPath, dir, 'metadata.json'), 'utf8');
        const parseData = JSON.parse(data);
        let setting;
        const result = Object.keys(parseData.ingredients).filter((key) => key.includes('ag-settings.json'));
        if (result[0]) {
          setting = fs.readFileSync(path.join(projectsMetaPath, dir, result[0]), 'utf8');
        } else {
          logger.error('fetchProjectsMeta.js', 'Unable to find ag-settings for the project');
        }
        if (setting) {
          logger.debug('fetchProjectsMeta.js', 'Found ag-settings for the project, merging ag-settings and burrito');
          burritos.push({ ...JSON.parse(setting), ...JSON.parse(data) });
        } else {
          logger.debug('fetchProjectsMeta.js', 'Unable to find ag-settings for the project so pushing only burrito');
          burritos.push(JSON.parse(data));
        }
        // resolve({ projects: burritos });
      }
      fs.stat(path.join(projectsMetaPath, dir), (err) => {
        if (err) { throw err; }
      });
    });
    logger.debug('fetchProjectsMeta.js', 'Returning project list');
    resolve({ projects: burritos });
  });
};
export default fetchProjectsMeta;
