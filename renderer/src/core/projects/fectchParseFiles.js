import Parse from 'parse';
import * as logger from '../../logger';

const fetchParseFiles = async (username, projectname) => {
    const ProjectMeta = Parse.Object.extend('ProjectMeta');
    const Files = Parse.Object.extend('Files');

    const findFiles = async () => {
        const newUserQuery = new Parse.Query(ProjectMeta);
        const filesQuery = new Parse.Query(Files);
        filesQuery.include('owner');
        newUserQuery.include('owner');
        await newUserQuery.find();
        const filesResult = await filesQuery.find();
        const files = [];
            filesResult.forEach((element) => {
                if (element.get('owner').get('owner').get('name') === username) {
                    if (element.get('owner').get('projectName') === projectname) {
                            files.push({
                                filename: (element).get('scope'),
                                data: (element).get('data'),
                                filenameAlias: (element).get('filenameAlias'),
                            });
                    }
                }
            });
            return files;
        };

    try {
       const files = await findFiles();
        return files;
      } catch (e) {
        logger.error('fetchParseFiles.js', e);
      }
};

export default fetchParseFiles;

// export const fetchFileData = async (fileURL) => {
//     const res = await fetch(fileURL);
//     const data = await res.text();
//     return data.results;
//   };
