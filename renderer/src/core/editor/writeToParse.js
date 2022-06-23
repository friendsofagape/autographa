// The below code is of web content

// import Parse from 'parse';
// import * as logger from '../../logger';

// const writeToParse = async ({
//     username,
//     projectName,
//     usfmData,
//     scope,
// }) => {
//         const ProjectMeta = Parse.Object.extend('ProjectMeta');
//         const Files = Parse.Object.extend('Files');
//         const newUserQuery = new Parse.Query(ProjectMeta);
//         const filesQuery = new Parse.Query(Files);
//         filesQuery.include('owner');
//         newUserQuery.include('owner');
//         await newUserQuery.find();
//         const filesResult = await filesQuery.find();
//         return new Promise((resolve) => {
//         filesResult.forEach(async (element) => {
//             if (element.get('owner').get('owner').get('name') === username) {
//                 if (element.get('owner').get('projectName') === projectName && element.get('scope') === scope) {
//                     if (element.get('data')) {
//                         element.set('data', usfmData);
//                         element.save();
//                     } else {
//                         element.set('data', usfmData);
//                         try {
//                             const res = await element.save();
//                             logger.info('writeToParse.js', `Saved to DB${res}`);
//                         } catch (error) {
//                             logger.info('writeToParse.js', `Unable to save data to DB${error}`);
//                         }
//                     }
//                     resolve(element.get('owner').get('projectName'));
//                 }
//             }
//         });
//     });
// };
// export default writeToParse;
