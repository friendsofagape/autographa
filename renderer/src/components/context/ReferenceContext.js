/* eslint-disable react/prop-types */
import { useBibleReference } from 'bible-reference-rcl';
import React, { useState, createContext } from 'react';

export const ReferenceContext = createContext({});

export default function ReferenceContextProvider({ children }) {
    const initialBook = 'mat';
    const initialChapter = '1';
    const initialVerse = '1';
    const [owner, setOwner] = useState('Door43-Catalog');
    const [languageId, setLanguageId] = useState('en');
    const [selectedResource, SetSelectedResource] = useState('');
    const [server, setServer] = useState('https://git.door43.org');
    const [branch, setBranch] = useState('master');
    const [markdown, setMarkdown] = useState('markdown');

    const {
   state: {
      chapter,
      verse,
      bookList,
      chapterList,
      verseList,
      bookName,
      bookId,
   }, actions: {
      onChangeBook,
      onChangeChapter,
      onChangeVerse,
      applyBooksFilter,
    },
  } = useBibleReference({
      initialBook,
      initialChapter,
      initialVerse,
    });

    const value = {
      state: {
        chapter,
        verse,
        bookList,
        chapterList,
        verseList,
        bookName,
        bookId,
        languageId,
        server,
        branch,
        owner,
        markdown,
        selectedResource,
      },
      actions: {
        setLanguageId,
        setBranch,
        setServer,
        setOwner,
        setMarkdown,
        SetSelectedResource,
        onChangeBook,
        onChangeChapter,
        onChangeVerse,
        applyBooksFilter,
      },
    };

    return (
      <ReferenceContext.Provider value={value}>
        {children}
      </ReferenceContext.Provider>
    );
  }
