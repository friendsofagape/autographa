/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import { useBibleReference } from 'bible-reference-rcl';
import React, { useState, createContext } from 'react';
import * as localforage from 'localforage';

export const ReferenceContext = createContext({});

export default function ReferenceContextProvider({ children }) {
    const initialBook = '1TI';
    const initialChapter = '1';
    const initialVerse = '1';
    const [owner, setOwner] = useState('Door43-Catalog');
    const [languageId, setLanguageId] = useState('en');
    const [selectedResource, SetSelectedResource] = useState('tn');
    const [server, setServer] = useState('https://git.door43.org');
    const [branch, setBranch] = useState('master');
    const [markdown, setMarkdown] = useState('markdown');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [refName, setRefName] = React.useState('null');
    const [currentScope, setCurrentScope] = React.useState([]);
    const [openResource, setOpenResource] = React.useState(true);
    // const [openResourcePopUp, setOpenResourcePopUp] = React.useState(false);
    const [selectedFont, setSelectedFont] = React.useState('sans-serif');
    const [fontSize, setFontsize] = React.useState(1);
    const [fonts, setFonts] = useState([]);
    const [layout, setLayout] = useState(0);
    const [refernceLoading, setRefernceLoading] = useState({
      status: false,
      text: '',
    });
    const [counter, setCounter] = useState(7);
    const [bookmarksVerses, setBookmarksVerses] = useState([]);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

  async function getFonts() {
    const _fonts = await localforage.getItem('font-family');
    fonts.push(_fonts);
    setFonts(fonts);
  }

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
        anchorEl,
        refName,
        currentScope,
        openResource,
        // openResourcePopUp,
        selectedFont,
        fontSize,
        fonts,
        layout,
        refernceLoading,
        counter,
        bookmarksVerses,
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
        setAnchorEl,
        handleClick,
        setRefName,
        setCurrentScope,
        setOpenResource,
        // setOpenResourcePopUp,
        setSelectedFont,
        setFontsize,
        setFonts,
        getFonts,
        setLayout,
        setRefernceLoading,
        setCounter,
        setBookmarksVerses,
      },
    };

    return (
      <ReferenceContext.Provider value={value}>
        {children}
      </ReferenceContext.Provider>
    );
  }
