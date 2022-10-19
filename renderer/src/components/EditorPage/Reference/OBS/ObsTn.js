/* eslint-disable react/prop-types */
import React, {
    useEffect,
   useState,
} from 'react';
import localForage from 'localforage';
import { getObsTn } from './getObsTn';
import ObsResourceCard from './ObsResourceCard';
import * as logger from '../../../../logger';

const fs = window.require('fs');

function ObsTnCard({
  resource,
  chapter,
  frame,
  languageId,
  classes,
  setQuote,
  selectedQuote,
  owner,
  resourceId,
  offlineResource,
  ...props
}) {
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [markdown, setMarkdown] = useState();

  useEffect(() => {
    if (items.length !== 0) {
      setMarkdown(items[index].OccurrenceNote);
    } else {
      setMarkdown('');
    }
  }, [items, index]);
  useEffect(() => {
    async function fetchData() {
      await getObsTn(owner, `${languageId}_${resourceId}`, `content/${chapter.toString().padStart(2, 0)}`)
      .then((data) => {
        setItems(data);
      });
    }
    async function fetchOfflineData() {
      try {
      localForage.getItem('userProfile').then(async (user) => {
          // console.log('inside offline fetch function :  ', offlineResource);
          logger.debug('OfflineResourceFetch.js', 'reading offline obs-tn ', offlineResource.data?.projectDir);
          const path = require('path');
          const newpath = localStorage.getItem('userPath');
          const currentUser = user?.username;
          const folder = path.join(newpath, 'autographa', 'users', `${currentUser}`, 'resources');
          const projectName = `${offlineResource.data?.value?.meta?.name}_${offlineResource.data?.value?.meta?.owner}_${offlineResource.data?.value?.meta?.release?.tag_name}`;
            if (fs.existsSync(path.join(folder, projectName))) {
              const contentDir = offlineResource.data?.value?.projects[0]?.path;
              const notesDir = path.join(folder, projectName, contentDir, chapter.toString().padStart(2, 0));
              const items = [];
              fs.readdir(notesDir, async (err, files) => {
                  if (err) {
                      // console.log(`Unable to scan directory: ${ err}`);
                      logger.debug('OfflineResourceFetch.js', 'reading offline dir not found err :  ', err);
                      throw err;
                  }
                  // listing all files using forEach
                  await files.forEach(async (file) => {
                      const filecontent = await fs.readFileSync(path.join(notesDir, file), 'utf8');
                      items.push({ OccurrenceNote: filecontent });
                  });
                  if (items.length === files.length) {
                    logger.debug('OfflineResourceFetch.js', 'reading offline obs-tn finished ');
                    setItems(items);
                  }
                  });
            }
          });
        } catch (err) {
            logger.debug('err on fetch local : ', err);
            throw err;
        }
    }
    setItems([]);
    setIndex(0);
    if (offlineResource && !offlineResource.offline) {
      fetchData();
    } else if (offlineResource && offlineResource.offline) {
      fetchOfflineData();
    }
  }, [chapter, languageId, owner, resourceId, offlineResource]);

  return (
    markdown ? (
      <ObsResourceCard
        {...props}
        chapter={chapter}
        verse={frame}
        items={items}
        selectedQuote={selectedQuote}
        setQuote={setQuote}
        markdown={markdown}
        languageId={languageId}
        classes={classes}
        shouldSetQuoteOnClick
        index={index}
        setIndex={(v) => setIndex(v)}
      />
) : ''
  );
}

export default ObsTnCard;
