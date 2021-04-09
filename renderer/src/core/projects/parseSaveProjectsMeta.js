/* eslint-disable consistent-return */
import Parse from 'parse';

import moment from 'moment';
import parseFileSave from './parseFileSave';

const parseSaveProjectsMeta = async (
    newProjectFields,
    selectedVersion,
    license,
    canonSpecification,
    content,
    versificationScheme,
) => {
    const username = 'Michael';

        const Person = Parse.Object.extend('Person');

        const ProjectMeta = Parse.Object.extend('ProjectMeta');

        const userExist = async () => {
            const personQuery = new Parse.Query(Person);
            personQuery.equalTo('name', username);
            const user = await personQuery.find();
            for (let i = 0; i < user.length; i += 1) {
                const Obj = user[i];
                return [Obj.get('name'), Obj];
            }
        };

        const projectExist = async () => {
            const personQuery = new Parse.Query(ProjectMeta);
            personQuery.equalTo('projectName', newProjectFields.projectName);
            const projects = await personQuery.find();
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < projects.length; i++) {
                const Obj = projects[i];
                return Obj.get('projectName');
            }
        };

        const FindDuplicateProjects = async () => {
            const newUserQuery = new Parse.Query(ProjectMeta);
            newUserQuery.equalTo('projectName', newProjectFields.projectName);
            newUserQuery.include('owner');
            newUserQuery.select('name');
            const result = await newUserQuery.find();
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < result.length; i++) {
                if (result[i].get('owner').get('name') === username) {
                    return result[i].get('owner').get('name');
                }
            }
        };

        const saveProject = async (person) => {
            const projectMeta = new ProjectMeta();
            projectMeta.set('projectName', newProjectFields.projectName);
            projectMeta.set('bibleVersion', selectedVersion);
            projectMeta.set('language', newProjectFields.language);
            projectMeta.set('scriptDirection', newProjectFields.scriptDirection);
            projectMeta.set('versificationScheme', versificationScheme);
            projectMeta.set('canonspecification', canonSpecification);
            projectMeta.set('canoncontent', content);
            projectMeta.set('license', license);
            projectMeta.set('starred', false);
            projectMeta.set('date', moment().format('DD-MM-YYYY'));
            projectMeta.set('lastview', moment().format('YYYY-MM-DD h:mm:ss'));
            projectMeta.set('owner', person);
            projectMeta.save();
            const writeData = 'this is the test data inside usfm file';
            content.forEach((filename) => {
                parseFileSave(
                    writeData,
                    filename,
                    projectMeta,
                );
            });
        };

        userExist().then((userRes) => {
            if ((userRes !== undefined ? userRes[0] : userRes) !== username) {
                const person = new Person();
                person.set('name', username);
                person.set('lastname', 'Philips');
                person.set('email', 'example@mail.com');
                saveProject(person);
            } else {
                projectExist().then(async (projectRes) => {
                    if ((projectRes !== newProjectFields.projectName)) {
                            saveProject(userRes[1]);
                    } else {
                        FindDuplicateProjects().then((result) => {
                            if (result === undefined && result !== username) {
                                saveProject(userRes[1]);
                            }
                        });
                    }
                });
            }
        });
};

export default parseSaveProjectsMeta;
