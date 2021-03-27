/* eslint-disable consistent-return */
import Parse from 'parse';

const parseFetchProjects = async () => {
    const username = 'Michael';

    // const Person = Parse.Object.extend('Person');
    const ProjectMeta = Parse.Object.extend('ProjectMeta');
    const projectsMetadata = [];

    const FindDuplicateProjects = async () => {
        const newUserQuery = new Parse.Query(ProjectMeta);
        newUserQuery.include('owner');
        const result = await newUserQuery.find();
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < result.length; i++) {
            if (result[i].get('owner').get('name') === username) {
                projectsMetadata.push(result[i]);
            }
        }
    };
    try {
        await FindDuplicateProjects();
        return projectsMetadata;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
};
export default parseFetchProjects;
