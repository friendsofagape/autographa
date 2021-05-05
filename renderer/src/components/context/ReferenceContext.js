/* eslint-disable react/prop-types */
import React, { useState, createContext } from 'react';

export const ReferenceContext = createContext({});

export default function ReferenceContextProvider({ children }) {
    const [owner, setOwner] = useState('Door43-Catalog');
    const [languageId, setLanguageId] = useState('en');
    const [selectedResource, SetSelectedResource] = useState('');
    const [server, setServer] = useState('https://git.door43.org');
    const [branch, setBranch] = useState('master');
    const [bibleReference, setBibleReference] = useState({
      bookId: 'mat',
      chapter: '1',
      verse: '1',
    });

    function onReferenceChange(bookId, chapter, verse) {
      setBibleReference((prevState) => ({
        ...prevState,
        bookId,
        chapter,
        verse,
      }));
    }

    const value = {
      state: {
        bibleReference,
        languageId,
        server,
        branch,
        owner,
        selectedResource,
      },
      actions: {
        setLanguageId,
        setBranch,
        setServer,
        setOwner,
        onReferenceChange,
        SetSelectedResource,
      },
    };

    return (
      <ReferenceContext.Provider value={value}>
        {children}
      </ReferenceContext.Provider>
    );
  }
