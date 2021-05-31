/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { ProjectContext } from '@/components/context/ProjectContext';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import React, {
 useContext, useEffect, useRef, useState,
} from 'react';
// import { BasicUsfmEditor } from 'usfm-editor';
import * as localforage from 'localforage';
import writeToParse from '../../../core/editor/writeToParse';
import { isElectron } from '../../../core/handleElectron';
import writeToFile from '../../../core/editor/writeToFile';
// import InputSelector from './InputSelector';
import fetchFromParse from '../../../core/editor/fetchFromParse';
import findBookFromParse from '../../../core/editor/findBookFromParse';
import EditorSection from '../EditorSection';

const UsfmEditor = () => {
  const intervalRef = useRef();
  const [usfmInput, setUsfmInput] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [activeTyping, setActiveTyping] = useState(false);
  const [usfmOutput, setUsfmOutput] = useState();
  const [identification, setIdentification] = useState({});

  const username = 'Michael';
  const projectName = 'TEST PRO HiN';
  const {
    state: {
      bookId,
    },
    actions: {
      onChangeBook,
      onChangeChapter,
      onChangeVerse,
    },
  } = useContext(ReferenceContext);
  const {
    states: {
      selectedProject,
    },
   } = useContext(ProjectContext);

   const saveToParse = async () => {
      try {
        const usfm = await localforage.getItem('editorData');
        writeToParse({
          username, projectName, usfmData: usfm, scope: bookId.toUpperCase(), write: true,
        });
      } catch (err) {
        console.log(err);
      }
    };

  const handleEditorChange = (usfm) => {
    setUsfmOutput(usfm);
    if (isElectron()) {
      writeToFile({
        projectname: selectedProject,
        filename: bookId,
        data: usfm,
      });
    } else {
      localforage.setItem('editorData', usfm).then(
        () => localforage.getItem('editorData'),
        ).then(() => {
          setActiveTyping(true);
          console.log('saved to localforage');
        }).catch((err) => {
          // we got an error
          throw err;
        });
    }
  };

  // handle on active state change
  useEffect(() => {
    if (activeTyping) {
      intervalRef.current = setInterval(() => {
        saveToParse();
        setActiveTyping(false);
      }, 5000);
    } else {
      clearInterval(intervalRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTyping]);

  // handle unmount
  useEffect(() => {
    localStorage.setItem('_tabhistory', 'Editor');
    const intervalId = intervalRef.current;
      return () => {
        clearInterval(intervalId);
      };
  }, []);

  const handleInputChange = (usfm) => {
    setUsfmInput(usfm);
    setIdentification({});
  };

  const handleVersChange = (val) => {
    if (val) {
       onChangeChapter(val.chapter.toString());
       onChangeVerse(val.verseStart.toString());
    }
  };

  const onIdentificationChange = (id) => {
    const identification = typeof id === 'string' ? JSON.parse(id) : id;
    setIdentification(identification);
    console.log(identification, bookId);
    onChangeBook((identification.id).toLowerCase());
  };

  useEffect(() => {
    findBookFromParse({
      username, projectName, scope: bookId.toUpperCase(),
    }).then((scopefiles) => {
      scopefiles.forEach((file) => {
        if (file === bookId.toUpperCase()) {
          fetchFromParse({
          username, projectName, scope: bookId.toUpperCase(),
          }).then(async (data) => {
            if (data) {
              localforage.setItem('editorData', data).then(
                () => localforage.getItem('editorData'),
                ).then(() => {
                  handleInputChange(data);
                }).catch((err) => {
                  // we got an error
                  throw err;
                });
            }
          });
        } else {
          handleInputChange(undefined);
        }
      });
    });
  }, [bookId]);

  useEffect(() => {
    fetchFromParse({
      username, projectName, scope: bookId.toUpperCase(),
    }).then((data) => {
      if (data) {
        localforage.setItem('editorData', data).then(
          () => localforage.getItem('editorData'),
          ).then(() => {
            handleInputChange(data);
          }).catch((err) => {
            // we got an error
            throw err;
          });
      }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

return (
  <>
    {/* <div>
      <InputSelector onChange={handleInputChange} />
    </div> */}
    <span style={{
      float: 'right', left: '-6px', top: '-404px', paddingRight: '2px',
    }}
    >
      <EditorSection header="USFM EDITOR" editor>
        {usfmInput && (
        {/* <BasicUsfmEditor
          usfmString={usfmInput}
          key={usfmInput}
          onChange={handleEditorChange}
          onVerseChange={handleVersChange}
          readOnly={readOnly}
          identification={identification}
          onIdentificationChange={onIdentificationChange}
        /> */}
    )}
      </EditorSection>
    </span>
  </>
);
};

export default UsfmEditor;
