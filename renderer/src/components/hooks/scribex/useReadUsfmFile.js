import { useEffect, useState, useContext } from 'react';
import localforage from 'localforage';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import { readRefBurrito } from '../../../core/reference/readRefBurrito';
import { readFile } from '../../../core/editor/readFile';

//  hook to fetch usfmfile from system drive
export const useReadUsfmFile = () => {
  const [usfmData, setUsfmData] = useState([]);
  const {
    state: {
      bookId,
    },
  } = useContext(ReferenceContext);
  useEffect(() => {
    async function readLocalFile() {
      try {
        const userProfile = await localforage.getItem('userProfile');
        const userName = userProfile?.username;
        const projectName = await localforage.getItem('currentProject');
        const path = require('path');
        const newpath = localStorage.getItem('userPath');
        const metaPath = path.join(newpath, 'autographa', 'users', userName, 'projects', projectName, 'metadata.json');
        const metaData = JSON.parse(await readRefBurrito({ metaPath }));
        const _books = [];
        Object.entries(metaData.ingredients).forEach(async ([key, _ingredients]) => {
          if (_ingredients.scope) {
            const _bookID = Object.entries(_ingredients.scope)[0][0];
            const bookObj = { bookId: _bookID, fileName: key };
            _books.push(bookObj);
          }
        });
        const [currentBook] = _books.filter((bookObj) => bookObj.bookId === bookId?.toUpperCase());
          const fileData = await readFile({ projectname: projectName, filename: currentBook.fileName, username: userName });
          const books = [{
            selectors: { org: 'unfoldingWord', lang: 'en', abbr: 'ult' },
            bookCode: currentBook.bookId.toLowerCase(),
            data: fileData,
          }];
          // setUsfmData(fileData);
          setUsfmData(books);
      } catch (err) {
        return console.log(err);
      }
    }
    readLocalFile();
  }, [bookId]);
  return { usfmData };
};
