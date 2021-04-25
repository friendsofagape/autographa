import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from '../../main';
import BookNavigation from './BookNavigation';
import ReferenceSelector from '../Reference';

export default function BibleNavigationInit() {
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
      <ThemeProvider theme={theme}>
        <BookNavigation initial={initial} />
        <ReferenceSelector />
      </ThemeProvider>
    </>
  );
}
