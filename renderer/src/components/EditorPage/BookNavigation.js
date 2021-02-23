import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import BibleReference, { useBibleReference } from 'bible-reference-rcl';
import TranslationHelps from './TranslationHelps/TranslationHelps';
import TranslationWordList from './TranslationHelps/TranslationWordList';

const BookNavigation = ({ initial }) => {
  const {
    initialBook,
    initialChapter,
    initialVerse,
    supportedBooks,
    onChange,
    style,
  } = initial || {};

  const { state, actions } = useBibleReference({
    initialBook,
    initialChapter,
    initialVerse,
    onChange,
  });

  useEffect(() => {
    actions.applyBooksFilter(supportedBooks);
  }, [actions, supportedBooks]);
    return (
      <div>
        <br />
        <br />

        <div
          style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <BibleReference status={state} actions={actions} style={style} />
        </div>

        <br />
        <br />
        <TranslationHelps
          bookID={state.bookId}
          currentChapterID={state.chapter}
          currentVerse={state.verse}
        />
        <TranslationWordList
          bookID={state.bookId}
          currentChapterID={state.chapter}
          currentVerse={state.verse}
        />
      </div>
     );
};

export default BookNavigation;
BookNavigation.propTypes = {
  initial: PropTypes.object,
};
