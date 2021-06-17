/* eslint-disable no-underscore-dangle */
export const readRefMeta = async ({
    projectname,
}) => {
    const fs = window.require('fs');
    const path = require('path');
    const newpath = localStorage.getItem('userPath');
    const metaPath = path.join(
        newpath, 'autographa', 'users', 'username', 'projects', projectname,
    );
    return new Promise((resolve) => {
        if (fs.existsSync(metaPath)) {
        const files = fs.readdirSync(metaPath);
        const _files = [];
        // read dir to find references bundles
        files.forEach((file) => {
          const stat = fs.lstatSync(path.join(metaPath, file));
          if (stat.isDirectory() === true) {
            _files.push(file);
            resolve(_files);
          }
        });
        }
    });
};
