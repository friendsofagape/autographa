import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import TranslationHelpsCard from './TranslationHelpsCard';

const TranslationHelps = ({
 selectedResource, languageId, refName, bookId, chapter, verse, owner,
}) => {
  const {
    state: {
        branch,
    },
  } = useContext(ReferenceContext);

  const translationQuestionsPath = `${(chapter < 10) ? (`0${ chapter}`)
  : chapter}/${(verse < 10) ? (`0${ verse}`) : verse}.md`;
  const { t } = useTranslation();
    return (
      <>
        {(() => {
        switch (selectedResource) {
          case 'tn':
            return (
              <TranslationHelpsCard
                title={t('label-resource-tn')}
                verse={verse}
                chapter={chapter}
                projectId={bookId || 'mat'}
                branch={branch}
                languageId={languageId}
                resourceId="tn"
                owner={owner}
                server="https://git.door43.org"
              />
            );
          case 'twl':
            return (
              <TranslationHelpsCard
                title={t('label-resource-twl')}
                verse={verse}
                chapter={chapter}
                projectId={bookId || 'mat'}
                branch="master"
                viewMode="list"
                languageId="en"
                resourceId="twl"
                owner="test_org"
                server="https://git.door43.org"
              />
            );
          case 'twlm':
            return (
              <TranslationHelpsCard
                title={t('label-resource-twlm')}
                verse={verse}
                chapter={chapter}
                projectId={bookId || 'mat'}
                branch={branch}
                viewMode="markdown"
                languageId={languageId}
                resourceId="twl"
                owner={owner}
                server="https://git.door43.org"
              />
              );
          case 'tq':
            return (
              <TranslationHelpsCard
                title={t('label-resource-tq')}
                verse={verse}
                chapter={chapter}
                projectId={bookId || 'mat'}
                branch={branch}
                viewMode="question"
                languageId={languageId}
                resourceId="tq"
                filePath={translationQuestionsPath}
                owner={owner}
                server="https://git.door43.org"
              />
            );
          case 'bible':
            return (
              <TranslationHelpsCard
                title={t('label-resource-bible')}
                languageId={languageId}
                refName={refName}
                bookId={bookId}
                chapter={chapter}
                verse={verse}
              />
            );
          default:
            return null;
        }
      })()}
        {/* <div>
          <TranslationHelpsCard
            title="Translation Words List"
            verse={verse}
            chapter={chapter}
            projectId={bookId || 'mat'}
            branch="master"
            viewMode="list"
            languageId="en"
            resourceId="twl"
            owner="test_org"
            server="https://git.door43.org"
          />
          <TranslationHelpsCard
            title="Translation Words"
            verse={verse}
            chapter={chapter}
            projectId={bookId || 'mat'}
            branch="master"
            viewMode="markdown"
            languageId="en"
            resourceId="twl"
            owner="test_org"
            server="https://git.door43.org"
          />
          <TranslationHelpsCard
            title="Translation Questions"
            verse={verse}
            chapter={chapter}
            projectId={bookId || 'mat'}
            branch="master"
            viewMode="question"
            languageId="en"
            resourceId="tq"
            filePath={null}
            owner="test_org"
            server="https://git.door43.org"
          />
        </div> */}
      </>
      );
};

export default TranslationHelps;

TranslationHelps.propTypes = {
  selectedResource: PropTypes.string,
  languageId: PropTypes.string,
  refName: PropTypes.string,
  bookId: PropTypes.string,
  chapter: PropTypes.string,
  verse: PropTypes.string,
  owner: PropTypes.string,
};
