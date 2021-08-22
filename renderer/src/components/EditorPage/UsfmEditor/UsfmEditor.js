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
// import * as localforage from 'localforage';
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
  const [identification, setIdentification] = useState({});
  const [goToVersePropValue, setGoToVersePropValue] = useState({});
  // const projectName = 'Spanish Pro';

  const supportedBooks = null; // if empty array or null then all books available
  const {
    states: {
      selectedProject,
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
    }, actions: {
      onChangeBook,
      onChangeChapter,
      onChangeVerse,
      applyBooksFilter,
    },
  } = useContext(ReferenceContext);

  const [naviagation, setNavigation] = useState({
    bookId,
    chapter,
    verse,
  });

  const _bookId = scrollLock === false ? bookId : naviagation.bookId;
  const _chapter = scrollLock === false ? chapter : naviagation.chapter;
  const _verse = scrollLock === false ? verse : naviagation.verse;

  useEffect(() => {
    applyBooksFilter(supportedBooks);
  }, [applyBooksFilter, supportedBooks]);

  const CustomEditor = useMemo(
    () => (withChapterPaging(createBasicUsfmEditor())),
    [usfmInput],
  );

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

  const handleEditorChange = (usfm) => {
    if (isElectron()) {
      readRefMeta({
        projectname: selectedProject,
        username,
      }).then((refs) => {
        refs.forEach((ref) => {
          readRefBurrito({
            projectname: selectedProject,
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
                      writeToFile({
                        username,
                        projectname: selectedProject,
                        filename: key,
                        data: usfm,
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
    setIdentification({});
  }, [usfmInput]);

  // reference tabs navigation

  const handleVersChange = useCallback(
    (val) => {
      if (val && scrollLock === false) {
        onChangeChapter(val.chapter.toString());
        onChangeVerse(val.verseStart.toString());
      }
    }, [onChangeChapter, onChangeVerse],
  );

  const onIdentificationChange = useCallback(
    (id) => {
      const identification = typeof id === 'string' ? JSON.parse(id) : id;
      setIdentification(identification);
      // onChangeBook((identification.id).toLowerCase());
    },
    [_bookId],
  );

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
      const path = require('path');
      const newpath = localStorage.getItem('userPath');
      const projectsDir = path.join(
          newpath, 'autographa', 'users', username, 'projects', selectedProject,
      );
      const metaPath = path.join(
        newpath, 'autographa', 'users', username, 'projects', selectedProject, 'metadata.json',
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
                        projectname: selectedProject,
                        filename: key,
                        username,
                      }).then((data) => {
                        if (data) {
                          handleInputChange(data);
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
    }
  }, [_bookId, _chapter]);

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
      readRefMeta({
        projectname: 'Test Burrito Project',
        username,
      }).then((refs) => {
        refs.forEach((ref) => {
          readRefBurrito({
            projectname: selectedProject,
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
                        projectname: selectedProject,
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
    }
  }, []);

  useEffect(() => {
    setGoToVersePropValue({
      chapter: parseInt(_chapter, 10),
      verse: parseInt(_verse, 10),
      key: Date.now(),
    });
  }, [_chapter]);

  return (
    <>
      <Editor setNavigation={setNavigation}>
        {usfmInput && (
          <CustomEditor
            ref={myEditorRef}
            usfmString={usfmInput}
            key={usfmInput}
            onChange={handleEditorChange}
            onVerseChange={handleVersChange}
            goToVerse={goToVersePropValue}
            readOnly={readOnly}
            identification={identification}
            onIdentificationChange={onIdentificationChange}
          />
        )}
      </Editor>

    </>
  );
};

export default UsfmEditor;
