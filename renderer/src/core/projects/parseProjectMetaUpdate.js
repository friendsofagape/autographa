// The below code is of web content

// import Parse from 'parse';

// const parseProjectMetaUpdate = async ({
//     username,
//     projectName,
//     // scope,
// }) => {
//         const ProjectMeta = Parse.Object.extend('ProjectMeta');
//         const newUserQuery = new Parse.Query(ProjectMeta);
//         newUserQuery.include('owner');
//         const userResult = await newUserQuery.find();
//         return new Promise((resolve) => {
//             userResult.forEach(async (element) => {
//                 if (element.get('owner').get('name') === username) {
//                     if (element.get('projectName') === projectName) {
//                             element.set('starred', !element.get('starred'));
//                             const res = await element.save();
//                             resolve(res);
//                     }
//                 }
//         });
//     });
// };
// export default parseProjectMetaUpdate;
