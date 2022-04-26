import Parse from 'parse';

const fetchFromParse = async ({
    username,
    projectName,
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
                if (element.get('owner').get('projectName') === projectName) {
                    if (element.get('scope') === scope) {
                       await resolve(element.get('data'));
                    }
                }
            }
        });
    });
};
export default fetchFromParse;
