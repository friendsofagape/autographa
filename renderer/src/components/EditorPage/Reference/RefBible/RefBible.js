/* eslint-disable no-underscore-dangle */
import { ReferenceContext } from '@/components/context/ReferenceContext';
import React, {
 useContext, useEffect, useState, useMemo,
} from 'react';
import {
  createBasicUsfmEditor, withChapterPaging, withChapterSelection, withToolbar,
 } from 'usfm-editor';
import * as localforage from 'localforage';
// eslint-disable-next-line import/no-unresolved
import { readIngredients } from '@/core/reference/readIngredients';

const RefBible = () => {
  const {
      state: {
        chapter,
        verse,
        bookId,
        languageId,
        refName,
    },
    actions: {
      applyBooksFilter,
    },
  } = useContext(ReferenceContext);
  // const regExp = /\(([^)]+)\)/;
    const [usfmInput, setUsfmInput] = useState();
    const CustomEditor = useMemo(
      () => (withChapterPaging(createBasicUsfmEditor())),
      [usfmInput],
      );
    useEffect(() => {
      localforage.getItem('refBibleBurrito')
      .then((refs) => {
        refs.forEach((ref) => {
          if (ref.languages[0].tag === languageId) {
              Object.entries(ref.ingredients).forEach(
                ([key]) => {
                  const _bookID = key.split('.')[0];
                  if (_bookID.split('-').pop() === bookId.toUpperCase() && refName !== null) {
                    readIngredients({
                      projectname: 'newprodir',
                      refName,
                      filePath: key,
                    }).then((res) => {
                      setUsfmInput(res);
                    });
                  }
                  // console.log(key, value),
                },
              );
          }
        });
      }).catch((err) => {
        // we got an error
        throw err;
      });
    }, [bookId, languageId]);

    // seting book scope for navigation
    // localforage.getItem('refBibleBurrito')
    //   .then((refs) => {
    //     refs.forEach((ref) => {
    //       if (ref.languages[0].tag === regExp.exec(languageId)[1]) {
    //         const scope = [];
    //         Object.entries((ref.type.flavorType.currentScope)).forEach(
    //             ([key]) => {
    //               scope.push(key);
    //               console.log(scope);
    //             },
    //             );
    //           }
    //         });
    //       });

  return (
    <>
      {usfmInput && (
        <CustomEditor
          usfmString={usfmInput}
          key={usfmInput}
          readOnly
          goToVerse={{
              chapter: parseInt(chapter),
              verse: parseInt(verse),
              key: Date.now(),
          }}
        />
      )}
    </>
  );
};

export default RefBible;
