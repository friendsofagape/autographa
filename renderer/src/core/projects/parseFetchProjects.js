import Parse from 'parse';
import * as logger from '../../logger';

const parseFetchProjects = async (username) => {
    // const Person = Parse.Object.extend('Person');
    const ProjectMeta = Parse.Object.extend('ProjectMeta');
    const projectsMetadata = [];

    const FindDuplicateProjects = async () => {
        const newUserQuery = new Parse.Query(ProjectMeta);
        newUserQuery.include('owner');
        const result = await newUserQuery.find();
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
        logger.error('parseFetchProjects.js', e);
      }
};
export default parseFetchProjects;
