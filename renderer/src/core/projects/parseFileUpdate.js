/* eslint-disable no-underscore-dangle */
import Parse from 'parse';
import parseFileSave from './parseFileSave';

const parseFileUpdate = async ({
    username,
    projectName,
    filename,
    data,
    filenameAlias,
    // scope,
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
        filesResult.forEach((element) => {
            if (element.get('owner').get('owner').get('name') === username) {
                if (element.get('owner').get('projectName') === projectName) {
                        if ((element).get('data') !== undefined) {
                              const response = parseFileSave({
                                writeData: data,
                                filename,
                                projectMeta: (element).get('owner'),
                                filenameAlias,
                              });
                                resolve(response);
                        }
                }
            }
        });
    });
};
export default parseFileUpdate;
