const loadData = (fs, file, projectName, username) => {
  const newpath = localStorage.getItem('userPath');
  const path = require('path');
  const filePath = path.join(newpath, 'autographa', 'users', username, 'resources', projectName);
  const data = fs.readFileSync(
    path.join(filePath, 'metadata.json'),
    'utf8',
  );
  const _data = JSON.parse(data);
  let i = 0;
  let j = 1;
  let dirName;
  while (i < j) {
    const firstKey = Object.keys(_data.ingredients)[i];
    const folderName = firstKey.split(/[(\\)?(/)?]/gm).slice(0);
    dirName = folderName[0];
    const stats = fs.statSync(path.join(filePath, dirName));
    if (!stats.isDirectory()) {
      j += 1;
    }
    i += 1;
  }
  const content = fs.readFileSync(path.join(filePath, dirName, `${file}.md`), 'utf8');
  return content;
};
const core = (fs, num, projectName, username) => {
  const stories = [];
  // eslint-disable-next-line prefer-const
  let id = 1;
  const data = loadData(fs, num.toString().padStart(2, 0), projectName, username);
  const allLines = data.split(/\r\n|\n/);
  // Reading line by line
  allLines.forEach((line) => {
    if (line) {
      if (line.match(/^(\s)*#/gm)) {
        const hash = line.match(/# (.*)/);
        stories.push({
          id, title: hash[1],
        });
        id += 1;
      } else if (line.match(/^(\s)*_/gm)) {
        const objIndex = stories.findIndex(((obj) => obj.id === id));
        if (objIndex !== -1 && Object.prototype.hasOwnProperty.call(stories[objIndex], 'img')) {
          stories[objIndex].text = '';
          id += 1;
        }
        const underscore = line.match(/_(.*)_/);
        stories.push({
          id, end: underscore[1],
        });
        id += 1;
      } else if (line.match(/^(\s)*!/gm)) {
        const objIndex = stories.findIndex(((obj) => obj.id === id));
        if (objIndex !== -1 && Object.prototype.hasOwnProperty.call(stories[objIndex], 'img')) {
          stories[objIndex].text = '';
          id += 1;
        }
        const imgUrl = line.match(/\((.*)\)/);
        stories.push({
          id, img: imgUrl[1],
        });
      } else {
        const objIndex = stories.findIndex(((obj) => obj.id === id));
        if (objIndex !== -1) {
          stories[objIndex].text = line;
          id += 1;
        }
      }
    }
  });
  return stories;
};
export default core;
