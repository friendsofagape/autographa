import Parse from 'parse';

const parseFetchProjects = async () => {
    const username = 'Michael';

    const Person = Parse.Object.extend('Person');
    const ProjectMeta = Parse.Object.extend('ProjectMeta');
    const projectsMetadata = [];

    const listUsers = async () => {
        const users = [];
        const personQuery = new Parse.Query(Person);
        const user = await personQuery.find();
        // eslint-disable-next-line arrow-body-style
        user.forEach((element) => {
            users.push(element.get('name'));
        });
        return users;
    };

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
        console.log(e);
      }
};
export default parseFetchProjects;
