import { useState, useEffect, useContext } from 'react';
import localforage from 'localforage';
import { isElectron } from '@/core/handleElectron';
import { readRefMeta } from '@/core/reference/readRefMeta';
import { readRefBurrito } from '@/core/reference/readRefBurrito';
import { readFile } from '@/core/editor/readFile';
import Editor from '@/modules/editor/Editor';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import writeToFile from '@/core/editor/writeToFile';
import EditorPanel from './EditorPanel';

export const getDetails = () => new Promise((resolve) => {
  localforage.getItem('userProfile').then((value) => {
    const username = value?.username;
    localforage.getItem('currentProject').then((projectName) => {
      const path = require('path');
      const newpath = localStorage.getItem('userPath');
      const projectsDir = path.join(newpath, 'autographa', 'users', username, 'projects', projectName);
      const metaPath = path.join(newpath, 'autographa', 'users', username, 'projects', projectName, 'metadata.json');
      resolve({
        projectName, username, projectsDir, metaPath, path,
      });
    });
  });
});
const ObsEditor = () => {
  const [mdData, setMdData] = useState();
  const [directoryName, setDirectoryName] = useState();
  const { state: { obsNavigation } } = useContext(ReferenceContext);
  const updateStory = (story) => {
    setMdData(story);
    let title; let body = ''; let end;
    story.forEach((s) => {
      if (Object.prototype.hasOwnProperty.call(s, 'title')) {
        title = `# ${s.title}\n\n`;
      }
      if (Object.prototype.hasOwnProperty.call(s, 'end')) {
        end = `_${s.end}_`;
      }
      if (Object.prototype.hasOwnProperty.call(s, 'text')) {
        body += `![OBS Image](${s.img})\n\n${s.text}\n\n`;
      }
    });
    const storyStr = title + body + end;
    getDetails().then((value) => {
      const bookID = obsNavigation.toString().padStart(2, 0);
      writeToFile({
        username: value.username,
        projectname: value.projectName,
        filename: (value.path).join(directoryName, `${bookID}.md`),
        data: storyStr,
      });
    });
  };
  useEffect(() => {
    if (isElectron()) {
      getDetails()
      .then(({
        projectName, username, projectsDir, metaPath, path,
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
                Object.entries(_data.ingredients).forEach(
                  ([key]) => {
                    const folderName = key.split(/[(\\)?(/)?]/gm).slice(0);
                    const dirName = folderName[0];
                    setDirectoryName(dirName);
                    const bookID = obsNavigation.toString().padStart(2, 0);
                    if (key === path.join(dirName, `${bookID}.md`)) {
                      readFile({
                        projectname: projectName,
                        filename: key,
                        username,
                      }).then((data) => {
                        if (data) {
                          const stories = [];
                          // eslint-disable-next-line prefer-const
                          let id = 1;
                          // eslint-disable-next-line react/prop-types
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
                          setMdData(stories);
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
  }, [obsNavigation]);
  return (
    <Editor callFrom="obs">
      {mdData
      && <EditorPanel obsStory={mdData} storyUpdate={updateStory} />}
    </Editor>
  );
};
export default ObsEditor;
