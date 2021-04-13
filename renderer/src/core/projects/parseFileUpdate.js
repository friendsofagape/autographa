/* eslint-disable no-underscore-dangle */
import Parse from 'parse';
import parseFileSave from './parseFileSave';

const parseFileUpdate = async ({
    username,
    projectName,
    filename,
    fileExtention,
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
        async function onDeleteImage(fileId) {
            const response = await fileId.destroy({ javascriptKey: true });
            return response;
        }
        filesResult.forEach((element) => {
            if (element.get('owner').get('owner').get('name') === username) {
                if (element.get('owner').get('projectName') === projectName) {
                        if ((element).get('file') !== undefined) {
                            if ((element).get('file')._name.split('_')[1] === `${filename}.${fileExtention}`) {
                            onDeleteImage((element)).then(() => {
                                console.log('Replacing');
                                parseFileSave(
                                    data,
                                    filename,
                                    fileExtention,
                                    (element).get('owner'),
                                    filenameAlias,
                                ).then(() => {
                                    console.log('updated');
                                });
                            });
                            }
                        }
                }
            }
        });
};
export default parseFileUpdate;
