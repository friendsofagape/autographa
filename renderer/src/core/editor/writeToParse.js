/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import Parse from 'parse';

const writeToParse = async ({
    username,
    projectName,
    usfmData,
    scope,
}) => {
        const ProjectMeta = Parse.Object.extend('ProjectMeta');
        const Files = Parse.Object.extend('Files');
        const newUserQuery = new Parse.Query(ProjectMeta);
        const filesQuery = new Parse.Query(Files);
        filesQuery.include('owner');
        newUserQuery.include('owner');
        await newUserQuery.find();
        const filesResult = await filesQuery.find();
        return new Promise((resolve) => {
        filesResult.forEach(async (element) => {
            if (element.get('owner').get('owner').get('name') === username) {
                if (element.get('owner').get('projectName') === projectName && element.get('scope') === scope) {
                    if (element.get('data')) {
                        element.set('data', usfmData);
                        element.save();
                    } else {
                        element.set('data', usfmData);
                        try {
                            const res = await element.save();
                            console.log('res', res);
                        } catch (error) {
                            console.log('error', error);
                        }
                    }
                    resolve(element.get('owner').get('projectName'));
                }
            }
        });
    });
};
export default writeToParse;
