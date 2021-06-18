import moment from 'moment';
import { createVersificationUSFM } from '../../util/createVersificationUSFM';

const saveProjectsMeta = (
    newProjectFields,
    selectedVersion,
    selectedLanguage,
    versificationScheme,
    canonSpecification,
    copyright,
) => {
    const newpath = localStorage.getItem('userPath');
    const status = [];
    const userdata = {
        projects: [
            {
            id: Date.now(),
            projectName: newProjectFields.projectName,
            bibleVersion: selectedVersion.name,
            abbreviation: selectedVersion.abbreviation,
            language: selectedLanguage.language,
            scriptDirection: selectedLanguage.scriptDirection,
            projectDescription: newProjectFields.description,
            versificationScheme,
            canonspecification:
            {
                canonSpecification: canonSpecification.title,
                canoncontent: canonSpecification.currentScope,
            },
            license: copyright.license,
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
        newpath, 'autographa', 'users', 'username', 'projects', 'projects.json',
    );
    fs.mkdirSync(path.join(
        newpath, 'autographa', 'users', 'username', 'projects',
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
                    'users',
                    'username',
                    'projects',
                    'projects.json'),
                    JSON.stringify(obj));
                    createVersificationUSFM(
                        'username',
                        newProjectFields.projectName,
                        versificationScheme,
                        canonSpecification.currentScope,
                    );
                    status.push({ type: 'success', value: 'projectmeta updated' });
            }
        }
 });
    } else {
        // Creating new file if nothing present
        fs.writeFileSync(path.join(
            newpath,
            'autographa',
            'users',
            'username',
            'projects',
            'projects.json',
        ), json);
        status.push({ type: 'success', value: 'new project created' });
        createVersificationUSFM(
            'username',
            newProjectFields.projectName,
            versificationScheme,
            canonSpecification.currentScope,
        );
    }
    return status;
};

export default saveProjectsMeta;
