/* eslint-disable react/jsx-no-constructed-context-values */
import { useBibleReference } from 'bible-reference-rcl';
import React, {
 useState, createContext, useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';

import * as localforage from 'localforage';
import { isElectron } from '../../core/handleElectron';
import * as logger from '../../logger';

export const ReferenceContext = createContext({});

export default function ReferenceContextProvider({ children }) {
    const initialBook = '1ti';
    const initialChapter = '1';
    const initialVerse = '1';
    const [owner, setOwner] = useState('Door43-catalog'); // "es-419_gl"
    const [languageId, setLanguageId] = useState('en');
    const [selectedResource, SetSelectedResource] = useState('tn');
    const [server, setServer] = useState('https://git.door43.org');
    const [branch, setBranch] = useState('master');
    const [markdown, setMarkdown] = useState('markdown');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [refName, setRefName] = React.useState('null');
    const [currentScope, setCurrentScope] = React.useState([]);
    const [openResource1, setOpenResource1] = React.useState(false);
    const [openResource2, setOpenResource2] = React.useState(true);
    const [openResource3, setOpenResource3] = React.useState(true);
    const [openResource4, setOpenResource4] = React.useState(true);
    const [openResourcePopUp, setOpenResourcePopUp] = React.useState(false);
    const [selectedFont, setSelectedFont] = React.useState('sans-serif');
    const [fontSize, setFontsize] = React.useState(1);
    const [layout, setLayout] = useState(0);
    const [row, setRow] = useState(0);
    const [refernceLoading, setRefernceLoading] = useState({
      status: false,
      text: '',
    });
    const [counter, setCounter] = useState(7);
    const [bookmarksVerses, setBookmarksVerses] = useState([]);
    const myEditorRef = useRef();
    const [closeNavigation, setCloseNavigation] = useState(false);
    const [projectScriptureDir, setProjectScriptureDir] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [folderPath, setFolderPath] = React.useState();
    const [openImportResourcePopUp, setOpenImportResourcePopUp] = useState(false);
    const [obsNavigation, setObsNavigation] = useState('1');
    const [selectedStory, setSelectedStory] = useState();
    const [taNavigationPath, setTaNavigationPath] = useState({
      option: '',
      path: '',
    });
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const openResourceDialog = async () => {
      if (isElectron()) {
        logger.debug('ImportResource.js', 'Inside openResourceDialog');
        const options = { properties: ['openDirectory'] };
        const { dialog } = window.require('@electron/remote');
        const chosenFolder = await dialog.showOpenDialog(options);
        setFolderPath(chosenFolder.filePaths[0]);
      }
  };

    useEffect(() => {
      localforage.getItem('currentProject').then((projectName) => {
        if (projectName) {
          const _projectname = projectName?.split('_');
          localforage.getItem('projectmeta').then((val) => {
            Object?.entries(val).forEach(
              ([, _value]) => {
                Object?.entries(_value).forEach(
                  ([, resources]) => {
                    if (resources.identification.name.en === _projectname[0]) {
                      switch (resources.type.flavorType.flavor.name) {
                        case 'textTranslation':
                          setBookmarksVerses(resources.project.textTranslation.bookMarks);
                          setProjectScriptureDir(resources.project.textTranslation.scriptDirection);
                          break;
                        case 'textStories':
                          setBookmarksVerses(resources.project.textStories.bookMarks);
                          setProjectScriptureDir(resources.project.textStories.scriptDirection);
                          break;
                        default:
                          break;
                      }
                    }
                  },
                );
              },
            );
          });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
      state: {
         chapter,
         verse,
         bookList,
         chapterList,
         verseList,
         bookName,
         bookId,
      }, actions: {
         onChangeBook,
         onChangeChapter,
         onChangeVerse,
         applyBooksFilter,
       },
     } = useBibleReference(
        {
          initialBook,
          initialChapter,
          initialVerse,
        },
      );

    useEffect(() => {
      localforage.getItem('navigationHistory').then((book) => {
        if (book) {
        onChangeBook(book[0]);
        onChangeChapter(book[1]);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const readBibleData = (bookId, chapter) => {
    //   setDisplayScreen(false);
    //   setIsLoading(true);
    //   localforage.getItem('userProfile').then((value) => {
    //     const username = value?.username;
    //     localforage.getItem('currentProject').then((projectName) => {
    //       const path = require('path');
    //       const newpath = localStorage.getItem('userPath');
    //       const projectsDir = path.join(
    //           newpath, 'autographa', 'users', username, 'projects', projectName,
    //       );
    //       const metaPath = path.join(
    //         newpath, 'autographa', 'users', username, 'projects', projectName, 'metadata.json',
    //       );
    //       readRefMeta({
    //         projectsDir,
    //       }).then((refs) => {
    //         setIsLoading(true);
    //         refs.forEach(() => {
    //           readRefBurrito({
    //             metaPath,
    //           }).then((data) => {
    //             if (data) {
    //               const _data = JSON.parse(data);
    //               const _books = [];
    //               Object.entries(_data.ingredients).forEach(
    //                 ([key, _ingredients]) => {
    //                   if (_ingredients?.scope) {
    //                     const _bookID = Object.entries(_ingredients.scope)[0][0];
    //                     _books.push(_bookID);
    //                     if (_bookID === bookId.toUpperCase()) {
    //                       readFile({
    //                         projectname: projectName,
    //                         filename: key,
    //                         username,
    //                       }).then((data) => {
    //                         if (data) {
    //                             timeout(2000).then(() => {
    //                               localforage.getItem('navigationHistory').then((book) => {
    //                                 if (book) {
    //                                   onChangeBook(book[0]);
    //                                   onChangeChapter(book[1]);
    //                                     if (book[0].toUpperCase() !== bookId.toUpperCase()) {
    //                                       setDisplayScreen(true);
    //                                     } else {
    //                                       handleInputChange(data);
    //                                     }
    //                                 }
    //                                 });
    //                             }).finally(() => {
    //                               setIsLoading(false);
    //                               setDisplayScreen(false);
    //                             });
    //                         }
    //                       });
    //                     }

    //                     // console.log(Object.entries(_ingredients.scope));
    //                   }
    //                   if (_ingredients.scope === undefined) {
    //                     if (_books.includes(bookId.toUpperCase()) === false) {
    //                       setDisplayScreen(true);
    //                       setIsLoading(false);
    //                     }
    //                   }
    //                   // console.log(key, value),
    //                 },
    //               );
    //             }
    //           });
    //         });
    //       });
    //     });
    //   });
    // };

    const goToChapter = (chapternum, versenum) => (
      {
        chapter: parseInt(chapternum || chapter, 10),
        verse: parseInt(versenum || verse, 10),
      }
    );

    const value = {
      state: {
        chapter,
        verse,
        bookList,
        chapterList,
        verseList,
        bookName,
        bookId,
        languageId,
        server,
        branch,
        owner,
        markdown,
        selectedResource,
        anchorEl,
        refName,
        currentScope,
        openResource1,
        openResource2,
        openResource3,
        openResource4,
        openResourcePopUp,
        selectedFont,
        fontSize,
        layout,
        row,
        refernceLoading,
        counter,
        bookmarksVerses,
        myEditorRef,
        closeNavigation,
        projectScriptureDir,
        isLoading,
        folderPath,
        openImportResourcePopUp,
        obsNavigation,
        selectedStory,
        taNavigationPath,
      },
      actions: {
        setLanguageId,
        setBranch,
        setServer,
        setOwner,
        setMarkdown,
        SetSelectedResource,
        onChangeBook,
        onChangeChapter,
        onChangeVerse,
        applyBooksFilter,
        setAnchorEl,
        handleClick,
        setRefName,
        setCurrentScope,
        setOpenResource1,
        setOpenResource2,
        setOpenResource3,
        setOpenResource4,
        setOpenResourcePopUp,
        setSelectedFont,
        setFontsize,
        setLayout,
        setRow,
        setRefernceLoading,
        setCounter,
        setBookmarksVerses,
        setCloseNavigation,
        setProjectScriptureDir,
        setIsLoading,
        goToChapter,
        setFolderPath,
        setOpenImportResourcePopUp,
        openResourceDialog,
        setObsNavigation,
        setSelectedStory,
        setTaNavigationPath,
      },
    };

    return (
      <ReferenceContext.Provider value={value}>
        {children}
      </ReferenceContext.Provider>
    );
  }
  ReferenceContextProvider.propTypes = {
    children: PropTypes.any,
  };
