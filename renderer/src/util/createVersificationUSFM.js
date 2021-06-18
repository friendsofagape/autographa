const grammar = require('usfm-grammar');
const path = require('path');

export const createVersificationUSFM = () => {
  const newpath = localStorage.getItem('userPath');
  const versification = 'kjv';
  const books = ['TIT', 'JUD'];
  const folder = path.join(newpath, 'autographa', 'users', 'username', 'projects', 'Test Bible', 'ingredients');
  const schemes = [
    { name: 'kjv', file: 'eng.json' },
    { name: '', file: 'ethiopian_custom.json' },
    { name: '', file: 'lxx.json' },
    { name: '', file: 'org.json' },
    { name: '', file: 'rsc.json' },
    { name: '', file: 'rso.json' },
    { name: '', file: 'vul.json' },
  ];
  schemes.forEach((scheme) => {
    if (versification === scheme.name) {
      // eslint-disable-next-line import/no-dynamic-require
      const file = require(`../lib/versification/${scheme.file}`);
      books.forEach((book) => {
        const list = file.maxVerses;
        if (list[book]) {
          const chapters = [];
          (list[book]).forEach((verse, i) => {
            // eslint-disable-next-line vars-on-top
            let contents = [{ p: null }];
            const verses = [];
            for (let i = 1; i <= parseInt(verse, 10); i += 1) {
              verses.push({
                verseNumber: i.toString(),
                verseText: '',
                // contents: [],
              });
            }
            contents = contents.concat(verses);
            chapters.push({
              chapterNumber: (i + 1).toString(),
              contents,
            });
          });
          const usfm = {
            book: {
              bookCode: book,
            },
            chapters,
            // _messages: {
            //   _warnings: [],
            // },
          };
          const myJsonParser = new grammar.JSONParser(usfm);
          const isJsonValid = myJsonParser.validate();
          if (isJsonValid) {
            const reCreatedUsfm = myJsonParser.toUSFM();
            const fs = window.require('fs');
            if (!fs.existsSync(folder)) {
              fs.mkdirSync(folder, { recursive: true });
            }
            fs.writeFileSync(path.join(folder, `${book}.usfm`), reCreatedUsfm);
          }
        }
      });
    }
  });
};
