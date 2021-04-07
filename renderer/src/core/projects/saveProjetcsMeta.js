import moment from 'moment';

const saveProjectsMeta = (
    newProjectFields,
    selectedVersion,
    license,
    canonSpecification,
    content,
    versificationScheme,
) => {
    const newpath = localStorage.getItem('userPath');
    const status = [];
    const userdata = {
        projects: [
            {
            id: Date.now(),
            projectName: newProjectFields.projectName,
            bibleVersion: selectedVersion,
            language: newProjectFields.language,
            scriptDirection: newProjectFields.scriptDirection,
            versificationScheme,
            canonspecification:
            {
                canonSpecification,
                canoncontent: content,
            },
            license,
            starred: false,
            createdAt: moment().format('DD-MM-YYYY'),
            updatedAt: moment().format('YYYY-MM-DD h:mm:ss'),
            },

        ],
    };
    const fs = window.require('fs');
    const path = require('path');
    const json = JSON.stringify(userdata);
    const projectsMetaPath = path.join(
        newpath, 'autographa', 'Userdata', 'Projects', 'user1', 'projects.json',
    );
    fs.mkdirSync(path.join(
        newpath, 'autographa', 'Userdata', 'Projects', 'user1',
    ), {
        recursive: true,
    });
    if (fs.existsSync(projectsMetaPath)) {
        let projectNameExists = false;
        fs.readFile(projectsMetaPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            } else {
            const obj = JSON.parse(data);
            obj.projects.forEach((element) => {
                if (element.projectName === newProjectFields.projectName) {
                    projectNameExists = true;
                    status.push({ type: 'Warning', value: 'projectname exists' }); // checking for duplicates
                }
            });
            if (projectNameExists === false) {
                // appending to an existing file
                obj.projects.push(userdata.projects[0]);
                fs.writeFileSync(path.join(newpath,
                    'autographa',
                    'Userdata',
                    'Projects',
                    'user1',
                    'projects.json'),
                    JSON.stringify(obj));
                    status.push({ type: 'success', value: 'projectmeta updated' });
            }
        }
 });
    } else {
        // Creating new file if nothing present
        fs.writeFileSync(path.join(
            newpath,
            'autographa',
            'Userdata',
            'Projects',
            'user1',
            'projects.json',
        ), json);
        status.push({ type: 'success', value: 'new project created' });
    }
    return status;
};

export default saveProjectsMeta;
