const loadData = (fs, file) => {
  const newpath = localStorage.getItem('userPath');
  const path = require('path');
  const filePath = path.join(newpath, 'autographa', 'Aa', 'sb_textStories-master', 'content');
  const content = fs.readFileSync(path.join(filePath, `${file}.md`), 'utf8');
  return content;
};
const core = (fs, num) => {
  const stories = [];
  // eslint-disable-next-line prefer-const
  let id = 1;
  const data = loadData(fs, num.toString().padStart(2, 0));
  const allLines = data.split(/\r\n|\n/);
  // Reading line by line
  allLines.forEach((line) => {
      if (line) {
        if (line.match(/^#/gm)) {
          const hash = line.match(/# (.*)/);
          stories.push({
            id, title: hash[1],
          });
          id += 1;
        } else if (line.match(/^_/gm)) {
          const underscore = line.match(/_(.*)_/);
          stories.push({
            id, end: underscore[1],
          });
          id += 1;
        } else if (line.match(/^!/gm)) {
          const imgUrl = line.match(/\((.*)\)/);
          stories.push({
            id, img: imgUrl[1],
          });
        } else {
          const objIndex = stories.findIndex(((obj) => obj.id === id));
          stories[objIndex].text = line;
          id += 1;
        }
      }
  });

  return stories;
};
export default core;
