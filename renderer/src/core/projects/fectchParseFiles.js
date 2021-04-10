/* eslint-disable consistent-return */
import Parse from 'parse';

const fetchParseFiles = async (username, projectname) => {
    const ProjectMeta = Parse.Object.extend('ProjectMeta');
    const Files = Parse.Object.extend('Files');
    const projectsMetadata = [];

    const FindDuplicateProjects = async () => {
        const newUserQuery = new Parse.Query(ProjectMeta);
        const filesQuery = new Parse.Query(Files);
        filesQuery.include('owner');
        newUserQuery.include('owner');
        await newUserQuery.find();
        const filesResult = await filesQuery.find();

        filesResult.forEach((element) => {
            if (element.get('owner').get('owner').get('name') === username) {
                if (element.get('owner').get('projectName') === projectname) {
                    // eslint-disable-next-line no-underscore-dangle
                    console.log((element).get('file')._name.split('_')[1]);
                    console.log((element).get('file'));
                    // eslint-disable-next-line no-underscore-dangle
                    fetch((element).get('file')._url)
                    .then((url) => url.text())
                    .then((usfmValue) => console.log(usfmValue));
                }
            }
        });
    };
    try {
        await FindDuplicateProjects();
        return projectsMetadata;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
};
export default fetchParseFiles;
