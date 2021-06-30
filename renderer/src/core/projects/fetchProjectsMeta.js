// eslint-disable-next-line consistent-return
const fetchProjectsMeta = () => {
    const newpath = localStorage.getItem('userPath');
    const fs = window.require('fs');
    const path = require('path');
    const projectsMetaPath = path.join(
        newpath, 'autographa', 'users', 'username', 'projects', 'projects.json',
    );
    return new Promise((resolve) => {
      if (fs.existsSync(projectsMetaPath)) {
        // eslint-disable-next-line
          const fileContent = fs.readFileSync(
            path.join(projectsMetaPath),
            'utf8',
          );
          resolve(JSON.parse(fileContent));
        }
    });
};
export default fetchProjectsMeta;
