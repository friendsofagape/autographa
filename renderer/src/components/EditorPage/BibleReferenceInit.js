import React from 'react';
import BookNavigation from './BookNavigation';
import TranslationHelps from './TranslationHelps/TranslationHelps';

const BibleReferenceInit = () => {
    const supportedBooks = null; // if empty array or null then all books available

    const initialBook = 'mat';
    const initialChapter = '2';
    const initialVerse = '1';

    const initial = {
        initialBook,
        initialChapter,
        initialVerse,
        supportedBooks,
    };
    return (
      <>
        <BookNavigation initial={initial} />
        <TranslationHelps />
      </>
      );
};

export default BibleReferenceInit;
