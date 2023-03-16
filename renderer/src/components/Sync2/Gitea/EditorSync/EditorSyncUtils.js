import * as localForage from 'localforage';
import { environment } from '../../../../../environment';
import * as logger from '../../../../logger';
import {
 createFiletoServer, getOrPutLastSyncInAgSettings, handleCreateRepo, updateFiletoServer,
} from '../../Ag/SyncToGiteaUtils';
import packageInfo from '../../../../../../package.json';

export async function getGiteaUsersList() {
  let usersList = [];
  await localForage.getItem('userProfile').then(async (user) => {
    const fs = window.require('fs');
    const path = require('path');
    const newpath = localStorage.getItem('userPath');
    const file = path.join(newpath, packageInfo.name, 'users', user?.username, environment.USER_SETTING_FILE);
    if (await fs.existsSync(file)) {
      const data = await fs.readFileSync(file);
      logger.debug('EditorSyncUtils.js', 'Successfully read the data from file , user : ', user?.username);
      const json = JSON.parse(data);
      usersList = json.sync?.services?.door43 || [];
    }
  });
  return usersList;
}

export async function handleEditorSync(selectedProject, projectData, syncObj, actions) {
  logger.debug('EditorAutoSync.js', 'Inside auto sync Project : ');
  const localUser = await localForage.getItem('userProfile');
  const fs = window.require('fs');
  const path = require('path');
  const newpath = localStorage.getItem('userPath');
  const authObj = syncObj?.token;
  const projectName = projectData.identification.name.en;
  const ingredientsObj = projectData.ingredients;
  const projectCreated = projectData.meta.dateCreated.split('T')[0];
  const repoName = `ag-${projectData.languages[0].tag}-${projectData.type.flavorType.flavor.name}-${projectName.replace(/[\s+ -]/g, '_')}`;
  const projectsMetaPath = path.join(newpath, packageInfo.name, 'users', localUser?.username, 'projects', selectedProject);
  actions?.settotalFiles((Object.keys(ingredientsObj).length) + 1);

  try {
    const createResult = await handleCreateRepo(repoName.toLowerCase(), authObj);
    if (createResult.id) {
      logger.debug('EditorSyncUtils.js', 'repo created success : starting sync');
      actions?.setUploadstart(true);
      // read metadata
      const Metadata = await fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
      await createFiletoServer(JSON.stringify(Metadata), 'metadata.json', `${localUser?.username}/${projectCreated}.1`, createResult.name, authObj);
      actions?.setTotalUploaded((prev) => prev + 1);
      // Read ingredients
      /* eslint-disable no-await-in-loop */
      /* eslint-disable no-restricted-syntax */
      for (const key in ingredientsObj) {
        if (Object.prototype.hasOwnProperty.call(ingredientsObj, key)) {
          actions?.setTotalUploaded((prev) => prev + 1);
          // setTotalUploadedAg((prev) => prev + 1);
          const Metadata1 = fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
          await createFiletoServer(Metadata1, key, `${localUser?.username}/${projectCreated}.1`, createResult.name, authObj);
        }
      }
      // update the Ag-settings - sync
      await getOrPutLastSyncInAgSettings('put', projectData, authObj?.user?.username);
      actions?.setUploadDone(true);
      logger.debug('EditorSyncUtils.js', 'Auto Sync finished create project and upload');
    } else if (createResult.message.includes('409')) {
      logger.debug('EditorSyncUtils.js', 'repo exist update section : 409 error');
      actions?.setUploadstart(true);
      const metadataContent = fs.readFileSync(path.join(projectsMetaPath, 'metadata.json'));
      await updateFiletoServer(JSON.stringify(metadataContent), 'metadata.json', `${localUser?.username}/${projectCreated}.1`, repoName, authObj);
      actions?.setTotalUploaded((prev) => prev + 1);
      // Read ingredients and update
      for (const key in ingredientsObj) {
        if (Object.prototype.hasOwnProperty.call(ingredientsObj, key)) {
          actions?.setTotalUploaded((prev) => prev + 1);
          const metadata1 = await fs.readFileSync(path.join(projectsMetaPath, key), 'utf8');
          // setTotalUploadedAg((prev) => prev + 1);
          await updateFiletoServer(metadata1, key, `${localUser?.username}/${projectCreated}.1`, repoName, authObj);
        }
      }
      // update the Ag-settings - sync update
      await getOrPutLastSyncInAgSettings('put', projectData, authObj?.user?.username);
      actions?.setUploadDone(true);
      logger.debug('SyncToGitea.js', 'sync successfull - update sync');
      } else {
        logger.debug('SyncToGitea.js', 'create/update not success on sync : ', createResult.message);
        throw new Error('sync failed - may be due to internet');
    }
  } catch (err) {
    logger.debug('SyncToGitea.js', 'Error on Sync create/update : ', err);
    throw new Error(err?.message || err);
  } finally {
    actions?.setUploadstart(false);
    actions?.setTotalUploaded(0);
    actions?.settotalFiles(0);
  }
}
