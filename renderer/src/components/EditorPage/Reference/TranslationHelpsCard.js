import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  useContent,
  useCardState,
} from 'translation-helps-rcl';
import localForage from 'localforage';
import ReferenceCard from './ReferenceCard';
import TranslationhelpsNav from './TranslationhelpsNav';
import * as logger from '../../../logger';

export default function TranslationHelpsCard({
  title,
  verse,
  server,
  owner,
  branch,
  chapter,
  filePath,
  setQuote,
  projectId,
  languageId,
  resourceId,
  selectedQuote,
  viewMode,
  offlineResource,
}) {
  const [offlineItems, setOfflineItems] = useState([]);
  const [offlineItemsDisable, setOfflineItemsDisable] = useState(false);
  const [offlineMarkdown, setOfflineMarkdown] = useState('');

  // eslint-disable-next-line prefer-const
  let { items, markdown, isLoading } = useContent({
    verse,
    chapter,
    projectId,
    branch,
    languageId,
    resourceId,
    filePath,
    owner,
    server,
  });

  // console.log('online data structure : ', { items, markdown, isLoading });

  useEffect(() => {
    if (offlineResource && offlineResource.offline) {
      // console.log('offline in Helpscard : ', offlineResource);
      // read tn tsv contents and pass to items
      try {
        setOfflineMarkdown('');
        setOfflineItems('');
        localForage.getItem('userProfile').then(async (user) => {
          logger.debug('TranslationHelpsCard.js', 'reading offline helps ', offlineResource.data?.projectDir);
          const fs = window.require('fs');
          const path = require('path');
          const newpath = localStorage.getItem('userPath');
          const currentUser = user?.username;
          const folder = path.join(newpath, 'autographa', 'users', `${currentUser}`, 'resources');
          const projectName = `${offlineResource?.data?.value?.meta?.name}_${offlineResource?.data?.value?.meta?.owner}_${offlineResource?.data?.value?.meta?.release?.tag_name}`;

          // switch resources
          switch (resourceId) {
            case 'tn':
              if (fs.existsSync(path.join(folder, projectName))) {
                // eslint-disable-next-line array-callback-return
                const currentFile = offlineResource?.data?.value?.projects.filter((item) => {
                  if (item?.identifier.toLowerCase() === projectId.toLowerCase()) {
                    return item;
                  }
              });
              // console.log('project name content : ', currentFile[0].path);
              const filecontent = await fs.readFileSync(path.join(folder, projectName, currentFile[0].path), 'utf8');
              // convert tsv to json
              const json = filecontent.split('\n')
                .map((file) => {
                    const [Book, Chapter, Verse, ID, SupportReference, OrigQuote, Occurrence, GLQuote, OccurrenceNote] = file.split('\t');
                    return {
                      Book, Chapter, Verse, ID, SupportReference, OrigQuote, Occurrence, GLQuote, OccurrenceNote,
                      };
                }).filter((data) => data.Chapter === chapter && data.Verse === verse);
                // change contents of items
                // console.log('file content : ', json);
                setOfflineItemsDisable(false);
                setOfflineItems(json);
              }
              break;

            case 'tq':
              if (fs.existsSync(path.join(folder, projectName))) {
                // check book avaialble
                  // console.log('project name found : ', { projectName, projectId });
                  // eslint-disable-next-line array-callback-return
                  offlineResource?.data?.value?.projects.filter((project) => {
                    if (project.identifier.toLowerCase() === projectId.toLowerCase()) {
                      const contentDir = path.join(folder, projectName, project.path, chapter.toString().padStart(2, 0));
                      if (fs.existsSync(path.join(contentDir, `${verse.toString().padStart(2, 0)}.md`))) {
                        const filecontent = fs.readFileSync(path.join(contentDir, `${verse.toString().padStart(2, 0)}.md`), 'utf8');
                        // console.log('content : ', { filecontent });
                        setOfflineItemsDisable(true);
                        setOfflineMarkdown(filecontent);
                      } else {
                        setOfflineMarkdown('');
                      }
                    }
                  });
              }
              break;

              case 'ta':
                // console.log('filepath : ', { projectId, filePath });
                setOfflineMarkdown('');
              if (filePath && projectId && fs.existsSync(path.join(folder, projectName, projectId, filePath))) {
                const filecontent = fs.readFileSync(path.join(folder, projectName, projectId, filePath), 'utf8');
                // console.log('filecontent : ', { filecontent });
                setOfflineItemsDisable(true);
                setOfflineMarkdown(filecontent);
              }
              break;

              case 'tw':
                // console.log('filepath : ', { filePath });
                setOfflineMarkdown('');
              if (filePath && fs.existsSync(path.join(folder, projectName, 'bible', filePath))) {
                const filecontent = fs.readFileSync(path.join(folder, projectName, 'bible', filePath), 'utf8');
                setOfflineItemsDisable(true);
                setOfflineMarkdown(filecontent);
              }
              break;

            default:
              break;
          }
        });
      } catch (err) {
        // console.log('err on fetch local tn: ', err);
        logger.debug('TranslationHelpsCard.js', 'reading offline helps Error :  ', err);
      }
    }
  }, [verse, chapter, languageId, resourceId, owner, offlineResource, projectId, items, filePath]);

  items = !offlineItemsDisable && offlineResource?.offline ? offlineItems : items;
  markdown = offlineResource?.offline ? offlineMarkdown : markdown;

  const {
    state: {
      item, headers, filters, fontSize, itemIndex, markdownView,
    },
    actions: {
      setFilters, setFontSize, setItemIndex, setMarkdownView,
    },
  } = useCardState({ items });
  return (
    <>
      <TranslationhelpsNav
        classes
        items={items}
        itemIndex={itemIndex}
        setItemIndex={setItemIndex}
      />
      <ReferenceCard
        items={items}
        headers={headers}
        filters={filters}
        fontSize={fontSize}
        itemIndex={itemIndex}
        setFilters={setFilters}
        setFontSize={setFontSize}
        setItemIndex={setItemIndex}
        markdownView={markdownView}
        setMarkdownView={setMarkdownView}
        item={item}
        markdown={markdown}
        isLoading={isLoading}
        languageId={languageId}
        title={title}
        viewMode={viewMode}
        selectedQuote={selectedQuote}
        setQuote={setQuote}
      />
    </>
  );
}

TranslationHelpsCard.propTypes = {
  viewMode: PropTypes.string,
  title: PropTypes.string.isRequired,
  chapter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  verse: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  server: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  languageId: PropTypes.string.isRequired,
  resourceId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  setQuote: PropTypes.func,
  selectedQuote: PropTypes.string,
  filePath: PropTypes.string,
  offlineResource: PropTypes.object,
};
