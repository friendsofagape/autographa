import * as localForage from 'localforage';
import * as logger from '../../../logger';
import fetchProjectsMeta from '../../../core/projects/fetchProjectsMeta';
import { handleCreateRepo, createFiletoServer, updateFiletoServer } from './GiteaUtils';

const path = require('path');

export const handleAutoSync = (selectedProject) => {
    logger.debug('EditorAutoSync.js', 'Inside auto sync Project : ', selectedProject);
    const projectName = (selectedProject.slice(0, selectedProject.lastIndexOf('_'))).toLowerCase();
    // console.log('project: ', projectName);
    localForage.getItem('userProfile').then(async (user) => {
        const userProjects = await fetchProjectsMeta({ currentUser: user?.username });
        const currentProject = userProjects.projects.filter((project) => project.identification.name.en.toLowerCase() === projectName);
        // auth params
        const fs = window.require('fs');
        const newpath = localStorage.getItem('userPath');
        const file = path.join(newpath, 'autographa', 'users', user?.username, 'ag-user-settings.json');
        if (fs.existsSync(file)) {
            fs.readFile(file, async (err, data) => {
            logger.debug('ProjectContext.js', 'Successfully read the data from file , user : ', user?.username);
            const json = JSON.parse(data);
            // setting default username for testing
            const defaultUsername = 'sijumoncy';
            const auth = json?.sync?.services?.door43.filter((item) => item.username === defaultUsername);
            // sync function rebuild
            const authObj = auth[0].token;
            const projectData = currentProject[0];
            // const projectId = Object.keys(projectData.identification.primary.ag)[0];
            const projectName = projectData.identification.name.en;
            const ingredientsObj = projectData.ingredients;
            const projectCreated = projectData.meta.dateCreated.split('T')[0];
            const repoName = `ag-${projectData.languages[0].tag}-${projectData.type.flavorType.flavor.name}-${projectName.replace(/[\s+ -]/g, '_')}`;
            const projectsMetaPath = path.join(newpath, 'autographa', 'users', user?.username, 'projects', selectedProject);

            await handleCreateRepo(repoName.toLowerCase(), authObj).then(
                async (result) => {
                    if (result.id) {
                        console.log('sync auto -- create repo + upload started');
                        logger.debug('EditorAutoSync.js', 'Auto Sync New project - repo + upload started');
                        const Metadata = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
                        await createFiletoServer(JSON.stringify(Metadata), 'metadata.json', user?.username, projectCreated, result.name, authObj);
                        // eslint-disable-next-line no-restricted-syntax
                        for (const key in ingredientsObj) {
                            if (Object.prototype.hasOwnProperty.call(ingredientsObj, key)) {
                                const Metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
                                // eslint-disable-next-line no-await-in-loop
                                await createFiletoServer(Metadata1, key, user?.username, projectCreated, result.name, authObj);
                            }
                        }
                        logger.debug('EditorAutoSync.js', 'Auto Sync finished create project and upload');
                        console.log('finished create project and upload');
                    }
                },
                async (error) => {
                    if (error.message.includes('409')) {
                        console.log('started update project ');
                        logger.debug('EditorAutoSync.js', 'Auto Sync existing project - update started');
                        const metadataContent = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
                        await updateFiletoServer(JSON.stringify(metadataContent), 'metadata.json', user.username, projectCreated, repoName, authObj);
                        // Read ingredients and update
                        // eslint-disable-next-line no-restricted-syntax
                        for (const key in ingredientsObj) {
                            if (Object.prototype.hasOwnProperty.call(ingredientsObj, key)) {
                            const metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
                            // eslint-disable-next-line no-await-in-loop
                            await updateFiletoServer(metadata1, key, user.username, projectCreated, repoName, authObj);
                            }
                        }
                        logger.debug('EditorAutoSync.js', 'Auto Sync existing project - update finished');
                        console.log('Finish updating project');
                    } else {
                        logger.debug('EditorAutoSync.js', 'calling autosync event - Repo Updation Error : ', error.message);
                        }
                    },
                );
            });
        }
    });
    // return (
    //   <h1>hello</h1>
    // );
  };
