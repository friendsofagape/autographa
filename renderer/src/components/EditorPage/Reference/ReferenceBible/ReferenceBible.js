/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import { ReferenceContext } from '@/components/context/ReferenceContext';
import React, {
 useContext, useEffect, useState, useMemo,
} from 'react';
import {
  createBasicUsfmEditor, withChapterPaging,
 } from 'usfm-editor';
import * as localforage from 'localforage';
// eslint-disable-next-line import/no-unresolved
import { readIngredients } from '@/core/reference/readIngredients';
import { ProjectContext } from '@/components/context/ProjectContext';
import { isElectron } from '../../../../core/handleElectron';

const ReferenceBible = ({
 languageId,
  refName,
 }) => {
  const {
      state: {
        chapter,
        verse,
        bookId,
    },
    actions: {
      setRefernceLoading,
      setCounter,
    },
  } = useContext(ReferenceContext);
  const {
    states: {
      username,
    },
  } = useContext(ProjectContext);
  // const regExp = /\(([^)]+)\)/;
    const [usfmInput, setUsfmInput] = useState();
    const CustomEditor = useMemo(
      () => (withChapterPaging(createBasicUsfmEditor())),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [usfmInput],
    );

    useEffect(() => {
      if (isElectron()) {
        const path = require('path');
        const newpath = localStorage.getItem('userPath');
        localforage.getItem('refBibleBurrito')
        .then((refs) => {
          refs.forEach((ref) => {
            if (ref.value.languages[0].tag === languageId) {
                Object.entries(ref.value.ingredients).forEach(
                  ([key, _ingredients]) => {
                    if (_ingredients.scope) {
                      const _bookID = Object.entries(_ingredients.scope)[0][0];
                      if (_bookID.split('-').pop() === bookId.toUpperCase() && refName !== null) {
                        const filePath = path.join(
                          newpath, 'autographa', 'users', username, 'reference', refName, key,
                        );
                        readIngredients({
                          filePath,
                        }).then((res) => {
                          setUsfmInput(res);
                          setRefernceLoading({
                            status: true,
                            text: 'Reference-burrito loaded succesfully',
                          });
                          setCounter(4);
                        });
                      }
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
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <span>
      {usfmInput && (
        <CustomEditor
          usfmString={usfmInput}
          key={usfmInput}
          readOnly
          goToVerse={{
              chapter: parseInt(chapter, 10),
              verse: parseInt(verse, 10),
              key: Date.now(),
          }}
        />

      )}
    </span>
  );
};

export default ReferenceBible;
