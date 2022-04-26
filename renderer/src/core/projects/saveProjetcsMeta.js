import moment from 'moment';
import * as localforage from 'localforage';
import { v5 as uuidv5 } from 'uuid';
import { createVersificationUSFM } from '../../util/createVersificationUSFM';
import createTranslationSB from '../burrito/createTranslationSB';
import * as logger from '../../logger';
import { environment } from '../../../environment';

const bookAvailable = (list, id) => list.some((obj) => obj === id);
const checker = (arr, target) => target.every((v) => arr.includes(v));

const saveProjectsMeta = async (
  newProjectFields,
  selectedLanguage,
  versificationScheme,
  canonSpecification,
  copyright,
  importedFiles,
  call,
  project,
) => {
  logger.debug('saveProjectsMeta.js', 'In saveProjectsMeta');
  const newpath = localStorage.getItem('userPath');
  const status = [];
  const fs = window.require('fs');
  const path = require('path');
  let currentUser;
  await localforage.getItem('userProfile').then((value) => {
    logger.debug('saveProjectsMeta.js', 'Fetching the current username');
    currentUser = value?.username;
  });
  fs.mkdirSync(path.join(
    newpath, 'autographa', 'users', currentUser, 'projects',
  ), {
    recursive: true,
  });
  const projectDir = path.join(newpath, 'autographa', 'users', currentUser, 'projects');
  let projectNameExists = false;
  let checkCanon = false;
  const folderList = fs.readdirSync(projectDir);
  folderList.forEach((folder) => {
    const name = folder.split('_');
    if (name[0] === newProjectFields.projectName && call === 'new') {
      projectNameExists = true;
      // checking for duplicates
      logger.warn('saveProjectsMeta.js', 'Project Name already exists');
      status.push({ type: 'warning', value: 'projectname exists' });
    }
  });
  importedFiles.forEach((file) => {
    if (!bookAvailable(canonSpecification.currentScope, file.id)) {
      checkCanon = true;
      logger.warn('saveProjectsMeta.js', `${file.id} is not added in Canon Specification or scope`);
      status.push({ type: 'warning', value: `${file.id} is not added in Canon Specification` });
    }
  });

  if (call === 'edit' && !checker((canonSpecification.currentScope), Object.keys(project.type.flavorType.currentScope))) {
    checkCanon = true;
    logger.warn('saveProjectsMeta.js', 'Not allowed to remove previous scope');
    status.push({ type: 'warning', value: 'You are not allowed to remove previous scope.' });
  }
  if (projectNameExists === false || call === 'edit') {
    if (checkCanon === false) {
      let id;
      let scope;
      if (call === 'new') {
        logger.debug('saveProjectsMeta.js', 'Creating a key for the Project');
      const key = currentUser + newProjectFields.projectName + moment().format();
      id = uuidv5(key, environment.uuidToken);
      scope = canonSpecification.currentScope;
      } else {
        logger.debug('saveProjectsMeta.js', 'Fetching the key from the existing Project');
        // from existing metadata
        scope = (canonSpecification.currentScope)
        .filter((x) => !(Object.keys(project.type.flavorType.currentScope)).includes(x));
        id = Object.keys(project?.identification?.primary?.ag);
        importedFiles.forEach((file) => {
          scope.push(file.id);
        });
      }
      // Create New burrito
      // ingredient has the list of created files in the form of SB Ingredients
      logger.debug('saveProjectsMeta.js', 'Calling creatVersification for generating USFM files.');
      await createVersificationUSFM(
        currentUser,
        newProjectFields,
        versificationScheme,
        scope,
        selectedLanguage.scriptDirection,
        id,
        importedFiles,
        copyright.title,
      ).then(async (ingredient) => {
        logger.debug('saveProjectsMeta.js', 'Calling createTranslationSB for creating burrito.');
        const burritoFile = await createTranslationSB(currentUser,
          newProjectFields,
          canonSpecification.currentScope,
          selectedLanguage.title,
          copyright.licence,
          id);
        if (call === 'edit') {
          burritoFile.ingredients = { ...project.ingredients, ...ingredient };
        } else {
        burritoFile.ingredients = ingredient;
        }
        logger.debug('saveProjectsMeta.js', 'Creating a burrito file.');
        await fs.writeFileSync(path.join(projectDir, `${newProjectFields.projectName}_${id}`,
          'metadata.json'), JSON.stringify(burritoFile));
      }).finally(() => {
        logger.debug('saveProjectsMeta.js', call === 'new' ? 'New project created successfully.' : 'Updated the Changes.');
        status.push({ type: 'success', value: (call === 'new' ? 'New project created' : 'Updated the changes') });
      });
    }
  } else {
    logger.warn('saveProjectsMeta.js', 'Project already exists');
    status.push({ type: 'error', value: 'Project already exists' });
  }
  return status;
};

export default saveProjectsMeta;
