/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import {
  useState, useEffect, useContext, useRef, useCallback,
 } from 'react';
 import {
  TrashIcon, MicrophoneIcon, VolumeUpIcon, StopIcon,
 } from '@heroicons/react/outline';
import Editor from '@/modules/editor/Editor';
import { AudioEditorPane } from '@/components/AudioRecorder/components/AudioEditorPane';
import { isElectron } from '@/core/handleElectron';
import { readRefMeta } from '@/core/reference/readRefMeta';
import { readRefBurrito } from '@/core/reference/readRefBurrito';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import { readFile } from '@/core/editor/readFile';
import EditorPage from '@/components/AudioRecorder/components/EditorPage';
import { SnackBar } from '@/components/SnackBar';
import { useTranslation } from 'react-i18next';
import { getDetails } from '../ObsEditor/ObsEditor';

const grammar = require('usfm-grammar');

const AudioEditor = () => {
  const [snackBar, setOpenSnackBar] = useState(false);
  const [snackText, setSnackText] = useState('');
  const [notify, setNotify] = useState();
  const [displyScreen, setDisplayScreen] = useState(false);
  const [mp3Path, setMp3Path] = useState();
  const { t } = useTranslation();
  const {
    state: {
      bookId,
      chapter,
      verse,
      myEditorRef,
      isLoading,
      audioContent,
    }, actions: {
      onChangeBook,
      onChangeChapter,
      onChangeVerse,
      applyBooksFilter,
      setIsLoading,
      goToChapter,
      setAudioContent,
      setAudioCurrentChapter,
    },
  } = useContext(ReferenceContext);

  useEffect(() => {
    if (isElectron()) {
      setIsLoading(true);
      setDisplayScreen(false);
      setAudioCurrentChapter();
      getDetails()
      .then(({
        projectName, username, projectsDir, metaPath,
        }) => {
        readRefMeta({
          projectsDir,
        }).then((refs) => {
          // setIsLoading(true);
          refs.forEach(() => {
            readRefBurrito({
              metaPath,
            }).then((data) => {
              if (data) {
                const _data = JSON.parse(data);
                Object.entries(_data.type.flavorType.currentScope).forEach(
                  async ([key]) => {
                    if (key === bookId.toUpperCase()) {
                      const fs = window.require('fs');
                      const path = require('path');
                      let bookContent = [];
                      const exists = fs.existsSync(path.join(projectsDir, 'text-1', 'ingredients', `${bookId.toUpperCase()}.usfm`));
                      // The project has any textTranslation data or not
                      if (exists) {
                        const usfm = fs.readFileSync(path.join(projectsDir, 'text-1', 'ingredients', `${bookId.toUpperCase()}.usfm`), 'utf8');
                        const myUsfmParser = new grammar.USFMParser(usfm);
                        const isJsonValid = myUsfmParser.validate();
                        if (isJsonValid) {
                          const jsonOutput = myUsfmParser.toJSON();
                          // Storing the chapters data in a array
                          bookContent = jsonOutput.chapters;
                        } else {
                          setNotify('failure');
                          setSnackText(t('dynamic-msg-invalid-usfm-file'));
                          setOpenSnackBar(true);
                        }
                      } else {
                        // Since this project doesn't have text data, we will create a JSON using the versification scheme
                        await readFile({
                          projectname: projectName,
                          filename: 'audio/ingredients/versification.json',
                          username,
                        }).then((value) => {
                          if (value) {
                            const file = JSON.parse(value);
                            const list = file.maxVerses;
                            if (list[bookId.toUpperCase()]) {
                              (list[bookId.toUpperCase()]).forEach((verse, c) => {
                                let contents = [];
                                const verses = [];
                                for (let v = 1; v <= parseInt(verse, 10); v += 1) {
                                    verses.push({
                                      verseNumber: v.toString(),
                                      verseText: '',
                                      audio: '',
                                    });
                                }
                                contents = contents.concat(verses);
                                bookContent.push({
                                  chapterNumber: (c + 1).toString(),
                                  contents,
                                });
                              });
                            }
                          }
                        });
                      }

                      // Getting the list of folders
                      const folders = fs.readdirSync(path.join(projectsDir, 'audio', 'ingredients'));
                      folders.forEach((folder) => {
                        // Checking whether the audio is available for the selected book
                        const re = new RegExp(bookId, 'gi');
                        const arr = folder.match(re);
                        if (arr) {
                          const filePath = path.join(projectsDir, 'audio', 'ingredients', arr[0]);
                          const folderName = fs.readdirSync(filePath);
                          folderName.forEach((chapterNum) => {
                            if (chapterNum === chapter) {
                              // Setting the bookContent to use it for updating the frontend data after every record,defaulting etc... without loading whole page
                              setAudioCurrentChapter({ bookContent, filePath, chapterNum });
                              const chapters = fs.readdirSync(path.join(filePath, chapterNum));
                              chapters.forEach((verse) => {
                                const url = path.parse(verse).name;
                                const verseNum = url.split('_');
                                Object.entries(bookContent).forEach(
                                  ([key]) => {
                                    if (bookContent[key].chapterNumber === chapter) {
                                      Object.entries(bookContent[key].contents).forEach(
                                        ([v]) => {
                                          if (bookContent[key].contents[v].verseNumber === verseNum[1]) {
                                            const url = 'https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3';
                                            if (verseNum[2]) {
                                              const take = `take${verseNum[2]}`;
                                              bookContent[key].contents[v][take] = url;
                                              if (verseNum[3] === 'default') {
                                                bookContent[key].contents[v].default = take;
                                              }
                                            } else {
                                              // replace url with `${chapter}_${verseNum[1]}_1_default.mp3`
                                              bookContent[key].contents[v].take1 = url;
                                              bookContent[key].contents[v].default = 'take1';
                                              fs.renameSync(path.join(filePath, chapterNum, verse), path.join(filePath, chapterNum, `${chapter}_${verseNum[1]}_1_default.mp3`));
                                            }
                                            // bookContent[key].contents[v].audio = verse;
                                          }
                                        },
                                      );
                                    }
                                  },
                                );
                              });
                              setMp3Path(path.join(filePath, chapterNum));
                            }
                          });
                        }
                        // Should only display the content if it has text or audio or both text and audio
                        if (arr || exists) {
                          Object.entries(bookContent).forEach(
                            ([key]) => {
                              if (bookContent[key].chapterNumber === chapter) {
                                // Storing the content in the ReferenceContext for the MainPlayer component
                                setAudioContent(bookContent[key].contents);
                              }
                            },
                          );
                          setIsLoading(false);
                          setOpenSnackBar(true);
                          setSnackText(t('dynamic-msg-load-ref-bible-snack', { projectName }));
                          setNotify('success');
                          setDisplayScreen(false);
                        }
                      });
                    }
                  },
                );
              }
            });
          });
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, chapter]);
  return (
    <Editor callFrom="textTranslation">
      {audioContent
      && <EditorPage content={audioContent} onChangeVerse={onChangeVerse} verse={verse} location={mp3Path} />}
      <SnackBar
        openSnackBar={snackBar}
        snackText={snackText}
        setOpenSnackBar={setOpenSnackBar}
        setSnackText={setSnackText}
        error={notify}
      />
    </Editor>
  );
 };
 export default AudioEditor;
