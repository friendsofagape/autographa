/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import { ProjectContext } from '@/components/context/ProjectContext';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import React, {
  useContext,
  useEffect,
  // useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import * as localforage from 'localforage';
import {
  createBasicUsfmEditor,
  withChapterPaging,
  //  withChapterSelection,
} from 'usfm-editor';
import Editor from '@/modules/editor/Editor';
import { readRefMeta } from '../../../core/reference/readRefMeta';
import { readRefBurrito } from '../../../core/reference/readRefBurrito';
import { readFile } from '../../../core/editor/readFile';
// import writeToParse from '../../../core/editor/writeToParse';
import { isElectron } from '../../../core/handleElectron';
import writeToFile from '../../../core/editor/writeToFile';
// import InputSelector from './InputSelector';
// import fetchFromParse from '../../../core/editor/fetchFromParse';
// import findBookFromParse from '../../../core/editor/findBookFromParse';

const UsfmEditor = () => {
  // const intervalRef = useRef();
  const [usfmInput, setUsfmInput] = useState();
  const [readOnly] = useState(false);
  // const [activeTyping, setActiveTyping] = useState(false);
  // const [identification, setIdentification] = useState();
  // const [goToVersePropValue, setGoToVersePropValue] = useState({});
  // const projectName = 'Spanish Pro';

  const supportedBooks = null; // if empty array or null then all books available
  const {
    states: {
      scrollLock,
      username,
    },
  } = useContext(ProjectContext);

  const {
    state: {
      bookId,
      chapter,
      verse,
      myEditorRef,
      closeNavigation,
    }, actions: {
      onChangeBook,
      onChangeChapter,
      onChangeVerse,
      applyBooksFilter,
    },
  } = useContext(ReferenceContext);

  useEffect(() => {
    applyBooksFilter(supportedBooks);
  }, [applyBooksFilter, supportedBooks]);

  const CustomEditor = useMemo(
    () => (withChapterPaging(createBasicUsfmEditor())),
    [usfmInput],
  );

  const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // const saveToParse = async () => {
  //   try {
  //     const usfm = await localforage.getItem('editorData');
  //     writeToParse({
  //       username, projectName, usfmData: usfm, scope: _bookId.toUpperCase(), write: true,
  //     });
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.log(err);
  //   }
  // };

  // handle on active state change
  // useEffect(() => {
  //   if (activeTyping) {
  //     intervalRef.current = setInterval(() => {
  //       saveToParse();
  //       setActiveTyping(false);
  //     }, 5000);
  //   } else {
  //     clearInterval(intervalRef.current);
  //   }
  // }, [activeTyping]);

  // handle unmount
  // useEffect(() => {
  //   localStorage.setItem('_tabhistory', 'Editor');
  //   const intervalId = intervalRef.current;
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  const handleInputChange = useCallback((usfm) => {
    setUsfmInput(usfm);
  }, [usfmInput]);

  // reference tabs navigation

  const handleVersChange = useCallback(
    (val) => {
      if (val && scrollLock === false) {
        // onChangeChapter(val.chapter.toString());
        onChangeVerse(val.verseStart.toString());
      }
    }, [onChangeChapter, onChangeVerse],
  );

  // const onIdentificationChange = useCallback(
  //   (id) => {
  //     const identification = typeof id === 'string' ? JSON.parse(id) : id;
  //     setIdentification(identification);
  //     // onChangeBook((identification.id).toLowerCase());
  //   },
  //   [bookId],
  // );

  useEffect(() => {
    if (scrollLock === false) {
      onChangeBook(bookId.toLowerCase());
      onChangeChapter(chapter.toLowerCase());
    }
  }, []);

  useEffect(() => {
    if (!isElectron()) {
      // findBookFromParse({
      //   username, projectName, scope: _bookId.toUpperCase(),
      // }).then((scopefiles) => {
      //   scopefiles.forEach((file) => {
      //     if (file === _bookId.toUpperCase()) {
      //       fetchFromParse({
      //         username, projectName, scope: _bookId.toUpperCase(),
      //       }).then(async (data) => {
      //         if (data) {
      //           localforage.setItem('editorData', data).then(
      //             () => localforage.getItem('editorData'),
      //           ).then(() => {
      //             handleInputChange(data);
      //           }).catch((err) => {
      //             // we got an error
      //             throw err;
      //           });
      //         }
      //       });
      //     } else {
      //       handleInputChange(undefined);
      //     }
      //   });
      // });
    } else {
      console.log('closeNavigation', closeNavigation);
      localforage.getItem('currentProject').then((projectName) => {
      const path = require('path');
      const newpath = localStorage.getItem('userPath');
      const projectsDir = path.join(
          newpath, 'autographa', 'users', username, 'projects', projectName,
      );
      const metaPath = path.join(
        newpath, 'autographa', 'users', username, 'projects', projectName, 'metadata.json',
      );
      readRefMeta({
        projectsDir,
      }).then((refs) => {
        refs.forEach(() => {
          readRefBurrito({
            metaPath,
          }).then((data) => {
            if (data) {
              const _data = JSON.parse(data);
              Object.entries(_data.ingredients).forEach(
                ([key, _ingredients]) => {
                  if (_ingredients.scope) {
                    const _bookID = Object.entries(_ingredients.scope)[0][0];
                    if (_bookID === bookId.toUpperCase()) {
                      readFile({
                        projectname: projectName,
                        filename: key,
                        username,
                      }).then((data) => {
                        if (data) {
                            timeout(3000).then(() => {
                                handleInputChange(data);
                            }).finally(() => console.log('editor loaded'));
                        }
                      });
                    }
                   }
                  // console.log(key, value),
                },
              );
            }
          });
        });
      });
    });
  }
  }, [bookId]);

  useEffect(() => {
    if (!isElectron()) {
      // fetchFromParse({
      //   username, projectName, scope: _bookId.toUpperCase(),
      // }).then((data) => {
      //   if (data) {
      //     localforage.setItem('editorData', data).then(
      //       () => localforage.getItem('editorData'),
      //     ).then(() => {
      //       handleInputChange(data);
      //     }).catch((err) => {
      //       // we got an error
      //       throw err;
      //     });
      //   }
      // });
    } else {
      localforage.getItem('currentProject').then((projectName) => {
      readRefMeta({
        projectname: projectName,
        username,
      }).then((refs) => {
        refs.forEach((ref) => {
          readRefBurrito({
            projectname: projectName,
            filename: ref,
            username,
          }).then((data) => {
            if (data) {
              const _data = JSON.parse(data);
              Object.entries(_data.ingredients).forEach(
                ([key, _ingredients]) => {
                  if (_ingredients.scope) {
                    const _bookID = Object.entries(_ingredients.scope)[0][0];
                    if (_bookID === bookId.toUpperCase()) {
                      readFile({
                        projectname: projectName,
                        filename: key,
                        username,
                      }).then((data) => {
                        if (data) {
                          handleInputChange(data);
                        }
                      });
                    }
                   }
                },
              );
            }
          });
        });
      });
    });
    }
  }, []);

  const handleEditorChange = (usfm) => {
    if (isElectron()) {
      localforage.getItem('currentProject').then((projectName) => {
        const path = require('path');
      const newpath = localStorage.getItem('userPath');
      const projectsDir = path.join(
          newpath, 'autographa', 'users', username, 'projects', projectName,
      );
      const metaPath = path.join(
        newpath, 'autographa', 'users', username, 'projects', projectName, 'metadata.json',
      );
      readRefMeta({
        projectsDir,
      }).then((refs) => {
        refs.forEach(() => {
          readRefBurrito({
            metaPath,
          }).then((data) => {
            if (data) {
              const _data = JSON.parse(data);
              Object.entries(_data.ingredients).forEach(
                ([key, _ingredients]) => {
                  if (_ingredients.scope) {
                    const _bookID = Object.entries(_ingredients.scope)[0][0];
                    if (_bookID === bookId.toUpperCase()) {
                      const arrayOfLines = usfm.split('\n');
                      const splitLine = arrayOfLines[0].split(/ +/);
                       if (splitLine[0] === '\\id') {
                          const id = splitLine[1];
                          if (id.toUpperCase() === bookId.toUpperCase()) {
                            setTimeout(() => {
                                writeToFile({
                                  username,
                                  projectname: projectName,
                                  filename: key,
                                  data: usfm,
                                });
                            }, 2000);
                          }
                        }
                    }
                   }
                  // console.log(key, value),
                },
              );
            }
          });
        });
      });
    });
    }
    // else {
    //   localforage.setItem('editorData', usfm).then(
    //     () => localforage.getItem('editorData'),
    //   ).then(() => {
    //     setActiveTyping(true);
    //   }).catch((err) => {
    //     // we got an error
    //     throw err;
    //   });
    // }
  };

  // useEffect(() => {
  //   setGoToVersePropValue({
  //     chapter: parseInt(chapter, 10),
  //     verse: parseInt(verse, 10),
  //     key: Date.now(),
  //   });
  // }, []);

  return (
    <>
      <Editor>
        {usfmInput && (
          <CustomEditor
            ref={myEditorRef}
            usfmString={usfmInput}
            key={usfmInput}
            onChange={handleEditorChange}
            onVerseChange={handleVersChange}
            readOnly={readOnly}
            goToVerse={{
              chapter: parseInt(chapter, 10),
              verse: parseInt(verse, 10),
            }}
            // identification={identification}
            // onIdentificationChange={onIdentificationChange}
          />
        )}
      </Editor>

    </>
  );
};

export default UsfmEditor;
