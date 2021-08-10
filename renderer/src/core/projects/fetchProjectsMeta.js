// eslint-disable-next-line consistent-return
import * as localforage from 'localforage';

const fetchProjectsMeta = async () => {
  const newpath = localStorage.getItem('userPath');
  let currentUser;
  await localforage.getItem('userProfile').then((value) => {
    currentUser = value?.username;
  });
  const fs = window.require('fs');
  const path = require('path');
  const projectsMetaPath = path.join(
    newpath, 'autographa', 'users', currentUser, 'projects',
  );
  fs.mkdirSync(projectsMetaPath, { recursive: true });
  const arrayItems = fs.readdirSync(projectsMetaPath);
  const burritos = [];
  return new Promise((resolve) => {
    arrayItems.forEach((dir) => {
      fs.stat(path.join(projectsMetaPath, dir), (err, stats) => {
        if (err) { throw err; }
        if (stats.isDirectory() && fs.existsSync(path.join(projectsMetaPath, dir, 'metadata.json'))) {
          fs.readFile(path.join(projectsMetaPath, dir, 'metadata.json'), 'utf8', (err, data) => {
            if (err) {
              return;
            }
            burritos.push(JSON.parse(data));
            resolve({ projects: burritos });
          });
        }
      });
    });
  });
};
export default fetchProjectsMeta;
