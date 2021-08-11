export const readRefBurrito = async ({
    projectname,
    username,
}) => {
    const fs = window.require('fs');
    const path = require('path');
    const newpath = localStorage.getItem('userPath');
    const projectsPath = path.join(
        newpath, 'autographa', 'users', username, 'projects', projectname, 'metadata.json',
    );
    return new Promise((resolve) => {
        if (fs.existsSync(projectsPath)) {
           const fileContent = fs.readFileSync(
                path.join(projectsPath),
                'utf8',
              );
              resolve((fileContent));
        }
    });
};
