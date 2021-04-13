/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
import Parse from 'parse';

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
                            // console.log((element).get('file')._name.split('_')[1]);
                            console.log((element).get('filenameAlias'));
                            files.push({
                                filename: (element).get('file')._name.split('_')[1],
                                filedataURL: (element).get('file')._url,
                                file: (element).get('file'),
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
        // eslint-disable-next-line no-console
        console.log(e);
      }
};

export default fetchParseFiles;

// export const fetchFileData = async (fileURL) => {
//     const res = await fetch(fileURL);
//     const data = await res.text();
//     return data.results;
//   };
