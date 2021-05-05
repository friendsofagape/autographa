import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import TranslationHelpsCard from './TranslationHelpsCard';
import ReferenceSelector from './ReferenceSelection';

const TranslationHelps = ({
  bookID,
  currentChapterID,
  currentVerse,
}) => {
  const {
    state: {
        languageId,
        server,
        branch,
        owner,
        selectedResource,
    },
  } = useContext(ReferenceContext);

  return (
    <>
      <ReferenceSelector />
      {(() => {
      switch (selectedResource) {
        case 'tn':
          return (
            <TranslationHelpsCard
              title="TranslationNotes"
              verse={currentVerse}
              chapter={currentChapterID}
              projectId={bookID || 'mat'}
              branch={branch}
              languageId={languageId}
              resourceId="tn"
              owner={owner}
              server={server}
            />
          );
        case 'twl':
          return (
            <TranslationHelpsCard
              title="Translation Words List"
              verse={currentVerse}
              chapter={currentChapterID}
              projectId={bookID || 'mat'}
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
              title="Translation Words"
              verse={currentVerse}
              chapter={currentChapterID}
              projectId={bookID || 'mat'}
              branch="master"
              viewMode="markdown"
              languageId="en"
              resourceId="twl"
              owner="test_org"
              server="https://git.door43.org"
            />
            );
        case 'tq':
          return (
            <TranslationHelpsCard
              title="Translation Questions"
              verse={currentVerse}
              chapter={currentChapterID}
              projectId={bookID || 'mat'}
              branch="master"
              viewMode="question"
              languageId="en"
              resourceId="tq"
              filePath={null}
              owner="test_org"
              server="https://git.door43.org"
            />
          );
        default:
          return null;
      }
    })()}
      {/* <div>
        <TranslationHelpsCard
          title="Translation Words List"
          verse={currentVerse}
          chapter={currentChapterID}
          projectId={bookID || 'mat'}
          branch="master"
          viewMode="list"
          languageId="en"
          resourceId="twl"
          owner="test_org"
          server="https://git.door43.org"
        />
        <TranslationHelpsCard
          title="Translation Words"
          verse={currentVerse}
          chapter={currentChapterID}
          projectId={bookID || 'mat'}
          branch="master"
          viewMode="markdown"
          languageId="en"
          resourceId="twl"
          owner="test_org"
          server="https://git.door43.org"
        />
        <TranslationHelpsCard
          title="Translation Questions"
          verse={currentVerse}
          chapter={currentChapterID}
          projectId={bookID || 'mat'}
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
  currentChapterID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  currentVerse: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  bookID: PropTypes.string.isRequired,
};
