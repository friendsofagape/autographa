// eslint-disable-next-line consistent-return
const fetchProjectsMeta = () => {
  const newpath = localStorage.getItem('userPath');
  const fs = window.require('fs');
  const path = require('path');
  const projectsMetaPath = path.join(
      newpath, 'autographa', 'users', 'username', 'projects', 'projects.json',
  );
if (fs.existsSync(projectsMetaPath)) {
  return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      fs.readFile(projectsMetaPath, 'utf8', (err, data) => {
        if (err) { return reject(err); }
        resolve(JSON.parse(data));
      });
    });
}
};
export default fetchProjectsMeta;
