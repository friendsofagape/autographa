/* eslint-disable no-underscore-dangle */
import Parse from 'parse';

const fetchFromParse = async ({
    _username,
    _projectName,
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
            if (element?.get('owner')?.get('owner')?.get('email') === _username) {
                if (element?.get('owner')?.get('projectName') === _projectName) {
                    if (element?.get('scope') === scope) {
                        const file = await element.get('ingredients');
                        fetch(file._url)
                        .then((response) => response.text())
                        .then((res) => {
                            resolve(res);
                        });
                        console.log(file);
                    }
                }
            }
        });
    });
};
export default fetchFromParse;
