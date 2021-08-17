/* eslint-disable no-unused-vars */
// import moment from 'moment';
import * as localforage from 'localforage';
import { createVersificationUSFM } from '../../util/createVersificationUSFM';
import createTranslationSB from '../burrito/createTranslationSB';

const saveProjectsMeta = async (
  newProjectFields,
  selectedVersion,
  selectedLanguage,
  versificationScheme,
  canonSpecification,
  copyright,
) => {
  const newpath = localStorage.getItem('userPath');
  const status = [];
  const fs = window.require('fs');
  const path = require('path');
  let currentUser;
  await localforage.getItem('userProfile').then((value) => {
    currentUser = value?.username;
  });
  fs.mkdirSync(path.join(
    newpath, 'autographa', 'users', currentUser, 'projects',
  ), {
    recursive: true,
  });
  const projectDir = path.join(newpath, 'autographa', 'users', currentUser, 'projects');
  let projectNameExists = false;
  const folderList = fs.readdirSync(projectDir);
  folderList.forEach((folder) => {
    if (folder === newProjectFields.projectName) {
      projectNameExists = true;
      // checking for duplicates
      status.push({ type: 'Warning', value: 'projectname exists' });
    }
  });

  if (projectNameExists === false) {
    // Create New burrito
    // ingredient has the list of created files in the form of SB Ingredients
    await createVersificationUSFM(
      currentUser,
      newProjectFields,
      versificationScheme,
      canonSpecification.currentScope,
      selectedLanguage.scriptDirection,
      selectedVersion,
    ).then(async (ingredient) => {
      const burritoFile = await createTranslationSB(currentUser,
        newProjectFields.projectName,
        canonSpecification.currentScope,
        selectedLanguage.title,
        copyright.licence);
      burritoFile.ingredients = ingredient;
      await fs.writeFileSync(path.join(projectDir, newProjectFields.projectName,
        'metadata.json'), JSON.stringify(burritoFile));
    }).finally(() => {
      status.push({ type: 'success', value: 'new project created' });
    });
  } else {
    status.push({ type: 'error', value: 'Project already exists' });
  }
  return status;
};

export default saveProjectsMeta;
