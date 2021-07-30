import burrito from '../../lib/BurritoTemplete.json';

const md5 = require('md5');

const fs = window.require('fs');
const path = require('path');

const uniqueProject = (projectsMetaPath, projectName) => {
  let projectNameExists = false;
  const fileContent = fs.readFileSync(
    path.join(projectsMetaPath),
    'utf8',
  );
  const obj = JSON.parse(fileContent);
  obj.projects.forEach((element) => {
    if (element.projectName === projectName) {
      console.log(projectName, '', element.projectName);
      projectNameExists = true;
      // status.push({ type: 'Warning', value: 'projectname exists' }); // checking for duplicates
    }
  });
  return projectNameExists;
  // console.log(projectNameExists === false);
};
const importBurrito = () => {
  const username = 'username';
  const newpath = localStorage.getItem('userPath');
  // Location of file to import
  const filePath = path.join(newpath,
    'autographa',
    'users',
    username,
    'projects',
    'Burrito Project');
  const projectsMetaPath = path.join(
    newpath, 'autographa', 'users', username, 'projects', 'projects.json',
  );
  fs.mkdirSync(path.join(
    newpath, 'autographa', 'users', username, 'projects',
  ), {
    recursive: true,
  });
  // Importing the project
  const sb = fs.readFileSync(path.join(filePath, 'metadata.json'));
  const metadata = JSON.parse(sb);
  let projectName;
  if (fs.existsSync(projectsMetaPath)) {
    const existingProject = uniqueProject(projectsMetaPath, metadata.identification.name.en);
    if (existingProject === true) {
      alert('Existing project');
      projectName = `${metadata.identification.name.en}_copy`;
    } else {
      projectName = metadata.identification.name.en;
    }
  }
  // console.log(metadata.ingredients);
  // console.log(metadata.type.flavorType.currentScope);
  Object.entries(metadata.ingredients).forEach(([key, value]) => {
    // console.log(`${key}: ${value}`);
    if (key.includes('.usfm')) {
      // Check the canonType of the burritos
      // Object.entries(metadata.type.flavorType.currentScope).forEach(([scope, v]) => {
      //   console.log(scope, value.scope);
      // });
      if (Object.getOwnPropertyNames(value.scope) in (metadata.type.flavorType.currentScope)) {
        // console.log((metadata.type.flavorType.currentScope), '.includes', (value.scope));
        console.log(key);
        const usfm = fs.readFileSync(path.join(filePath, key), 'utf8');
        const checksum = md5(usfm);
        // console.log(value.checksum.md5, checksum);
        if (checksum !== value.checksum.md5) {
          console.log('Change in the checksum');
        }
        const stats = fs.statSync(path.join(newpath,
          'autographa',
          'users',
          username,
          'projects',
          'Burrito Project',
          key));
        if (stats.size !== value.size) {
          console.log('Change the size');
        }
        metadata.ingredients[key].checksum.md5 = checksum;
        metadata.ingredients[key].size = stats.size;
        // fs.writeFileSync(path.join(folder, `${book}.usfm`), usfm);
      }
    }
  });
  metadata.meta.username = 'username1';
  metadata.identification.name.en = projectName;
  console.log(metadata);
  // fs.writeFileSync(path.join(folder, 'versification.json'), JSON.stringify(file));
  // const stats = fs.statSync(path.join(folder, 'versification.json'));
  // metadata.ingredients[path.join('ingredients', 'versification.json')] = {
  //   checksum: {
  //     md5: md5(file),
  //   },
  //   mimeType: 'application/json',
  //   size: stats.size,
  //   role: 'x-versification',
  // };
  // fs.writeFileSync(path.join(newpath,
  //   'autographa',
  //   'users',
  //   'username',
  //   'projects',
  //   projectName,
  //   'metadata.json'), JSON.stringify(metadata));
};
export default importBurrito;
