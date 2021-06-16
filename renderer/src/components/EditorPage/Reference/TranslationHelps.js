import React, { useContext } from 'react';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import TranslationHelpsCard from './TranslationHelpsCard';
import ReferenceCard from './ReferenceCard';

const TranslationHelps = () => {
  const {
    state: {
        bookId,
        chapter,
        verse,
        languageId,
        server,
        branch,
        owner,
        selectedResource,
    },
  } = useContext(ReferenceContext);

  return (
    <>
      {(() => {
      switch (selectedResource) {
        case 'tn':
          return (
            <TranslationHelpsCard
              title="Translation Notes"
              verse={verse}
              chapter={chapter}
              projectId={bookId || 'mat'}
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
            );
        case 'tq':
          return (
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
          );
        case 'bible':
          return (
            <ReferenceCard
              title="Bible"
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
