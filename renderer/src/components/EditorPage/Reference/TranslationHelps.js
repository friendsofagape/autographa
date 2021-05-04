import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { Workspace } from 'resource-workspace-rcl';
import PropTypes from 'prop-types';
import TranslationHelpsCard from './TranslationHelpsCard';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  dragIndicator: {},
}));
const TranslationHelps = ({
  bookID,
  currentChapterID,
  currentVerse,
}) => {
  const classes = useStyles();
  const [currentLayout, setCurrentLayout] = useState(null);
  const layout = {
    widths: [
      [1, 1, 2],
      [2, 2],
      [2, 2],
    ],
    heights: [[5], [10, 10], [10, 10]],
  };

  if (currentLayout) {
    layout.absolute = currentLayout;
  }
  return (
    <>
      <TranslationHelpsCard
        title="TranslationNotes"
        verse={currentVerse}
        chapter={currentChapterID}
        projectId={bookID || 'mat'}
        branch="master"
        languageId="en"
        resourceId="tn"
        owner="test_org"
        server="https://git.door43.org"
      />
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
    </>
    );
  };

export default TranslationHelps;

TranslationHelps.propTypes = {
  currentChapterID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  currentVerse: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  bookID: PropTypes.string.isRequired,
};
