// eslint-disable-next-line consistent-return
const fetchProjectsMeta = () => {
  const newpath = localStorage.getItem('userPath');
  const fs = window.require('fs');
  const path = require('path');
  const projectsMetaPath = path.join(
    newpath, 'autographa', 'users', 'username', 'projects',
  );
  fs.mkdirSync(projectsMetaPath, { recursive: true });
  const arrayItems = fs.readdirSync(projectsMetaPath);
  const burritos = [];
  return new Promise((resolve) => {
    arrayItems.forEach((dir) => {
      fs.stat(path.join(projectsMetaPath, dir), (err, stats) => {
        if (err) { throw err; }
        if (stats.isDirectory()) {
          fs.readFile(path.join(projectsMetaPath, dir, 'metadata.json'), 'utf8', (err, data) => {
            if (err) {
              return;
            }
            burritos.push(JSON.parse(data));
          });
        }
      });
    });
    resolve({ projects: burritos });
  });
};
export default fetchProjectsMeta;
