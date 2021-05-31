const writeToFile = ({
    projectname,
    filename,
    data,
}) => {
    const fs = window.require('fs');
    const path = require('path');
    const newpath = localStorage.getItem('userPath');
    const projectsPath = path.join(
        newpath, 'autographa', 'users', 'username', 'projects', projectname, `${filename.toUpperCase()}.usfm`,
    );
    if (fs.existsSync(projectsPath)) {
                // appending to an existing file
                fs.writeFileSync(projectsPath, data);
    } else {
        // Creating new file if nothing present
        fs.writeFileSync(projectsPath, data);
    }
};

export default writeToFile;
