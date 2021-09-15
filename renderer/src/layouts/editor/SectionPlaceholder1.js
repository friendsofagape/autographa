/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { ReferenceContext } from '@/components/context/ReferenceContext';
import EditorSection from '@/layouts/editor/EditorSection';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import ReferenceBible from '@/components/EditorPage/Reference/ReferenceBible/ReferenceBible';
import localforage from 'localforage';
import { ProjectContext } from '@/components/context/ProjectContext';
import CustomNavigation from '@/components/EditorPage/Navigation/CustomNavigation';

const TranslationHelps = dynamic(
  () => import('@/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);

const SectionPlaceholder1 = () => {
  const supportedBooks = null;
  const [referenceColumnOneData1, setReferenceColumnOneData1] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
  });
  const [referenceColumnOneData2, setReferenceColumnOneData2] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
  });
  const [loadResource1, setLoadResource1] = useState(false);
  const [loadResource2, setLoadResource2] = useState(false);
  const {
    state: {
      layout,
      openResource1,
      openResource2,
      openResource3,
      openResource4,
      bookId,
      chapter,
      verse,
    },
    actions: {
      setRow,
      setLayout,
      setOpenResource1,
      setOpenResource2,
      applyBooksFilter,
    },
  } = useContext(ReferenceContext);
  const {
    states: {
      scrollLock,
    },
  } = useContext(ProjectContext);
  const [sectionNum, setSectionNum] = useState(0);
  const [hideAddition, setHideAddition] = useState(true);
  const [naviagation1, setNavigation1] = useState({
    bookId,
    chapter,
    verse,
  });

  const [naviagation2, setNavigation2] = useState({
    bookId,
    chapter,
    verse,
  });

  const _bookId1 = scrollLock === false ? bookId : naviagation1.bookId;
  const _chapter1 = scrollLock === false ? chapter : naviagation1.chapter;
  const _verse1 = scrollLock === false ? verse : naviagation1.verse;

  const _bookId2 = scrollLock === false ? bookId : naviagation2.bookId;
  const _chapter2 = scrollLock === false ? chapter : naviagation2.chapter;
  const _verse2 = scrollLock === false ? verse : naviagation2.verse;

  useEffect(() => {
    applyBooksFilter(supportedBooks);
  }, [applyBooksFilter, supportedBooks]);

  useEffect(() => {
    if (layout > 0 && layout <= 2) {
      setRow(0);
      if (sectionNum === 0) {
        setSectionNum(1);
      }
    }
    // if (openResource1 === true && openResource2 === true) {
    //   setLayout(layout - 1);
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  useEffect(() => {
    const refsHistory = [];
    const rows = [];
    localforage.getItem('currentProject').then((projectName) => {
    const _projectname = projectName?.split('_');
    localforage.getItem('projectmeta').then((value) => {
      Object?.entries(value).forEach(
        ([_columnnum, _value]) => {
          Object?.entries(_value).forEach(
            ([_rownum, resources]) => {
              if (resources.project.textTranslation.projectName === _projectname[0]) {
                refsHistory.push(resources.project.textTranslation.refResources);
              }
            },
          );
        },
      );
    }).then(() => {
      if (refsHistory[0]) {
        Object?.entries(refsHistory[0]).forEach(
          ([_columnnum, _value]) => {
          if (_columnnum === '0') {
            Object?.entries(_value).forEach(
              ([_rownum, _value]) => {
                rows.push(_rownum);
                if (openResource1 === false
                  || openResource2 === false) {
                    if (_rownum === '1') {
                      setReferenceColumnOneData1({
                        languageId: _value?.language,
                        selectedResource: _value?.resouceId,
                        refName: _value?.name,
                        header: _value?.name,
                      });
                  }
                  if (_rownum === '2') {
                      setReferenceColumnOneData2({
                        languageId: _value?.language,
                        selectedResource: _value?.resouceId,
                        refName: _value?.name,
                        header: _value?.name,
                      });
                  }
                }
              },
            );
          }
        },
      );
      }
    }).then(() => {
      if (refsHistory[0]) {
      setLayout(refsHistory[0].length);
      if (rows.length > 1) {
        setLoadResource1(true);
        setLoadResource2(true);
        setOpenResource1(false);
        setOpenResource2(false);
      }
      if (rows.length === 1) {
        setLoadResource1(true);
        setOpenResource1(false);
      }
      setSectionNum(rows.length);
    }
    });
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sectionNum === 2) {
      setHideAddition(false);
    } else {
      setHideAddition(true);
    }
  }, [sectionNum]);

  useEffect(() => {
    const refsHistory = [];
    localforage.getItem('currentProject').then((projectName) => {
    const _projectname = projectName?.split('_');
    localforage.getItem('projectmeta').then((value) => {
      Object?.entries(value).forEach(
        ([_columnnum, _value]) => {
          Object?.entries(_value).forEach(
            ([_rownum, resources]) => {
              if (resources.project.textTranslation.projectName === _projectname[0]) {
                refsHistory.push(resources.project.textTranslation.refResources);
                if (sectionNum === 1 || sectionNum === 0) {
                  if (openResource1
                    && openResource2) {
                      resources.project.textTranslation.refResources.splice(0, 1);
                    }
                }
                if (sectionNum === 1) {
                  resources.project.textTranslation.refResources[0] = {
                      1: {
                        resouceId: referenceColumnOneData1?.selectedResource,
                        language: referenceColumnOneData1?.languageId,
                        name: referenceColumnOneData1?.refName,
                        navigation: { book: '1TI', chapter: '1' },
                      },
                    };
                }
                if (sectionNum === 2) {
                  if (referenceColumnOneData1.refName !== undefined) {
                    resources.project.textTranslation.refResources[0] = {
                    1: {
                      resouceId: referenceColumnOneData1?.selectedResource,
                      language: referenceColumnOneData1?.languageId,
                      name: referenceColumnOneData1?.refName,
                      navigation: { book: '1TI', chapter: '1' },
                    },
                    2: {
                      resouceId: referenceColumnOneData2?.selectedResource,
                      language: referenceColumnOneData2?.languageId,
                      name: referenceColumnOneData2?.refName,
                      navigation: { book: '1TI', chapter: '1' },
                    },
                  };
                }
              }
              }
            },
          );
        },
      );
    localforage.setItem('projectmeta', value);
    });
  });
  }, [openResource1, openResource2, referenceColumnOneData1?.languageId,
    referenceColumnOneData1.refName, referenceColumnOneData1?.selectedResource,
    referenceColumnOneData2?.languageId, referenceColumnOneData2?.refName,
    referenceColumnOneData2?.selectedResource, sectionNum]);

  const CustomNavigation1 = (
    <CustomNavigation
      setNavigation={setNavigation1}
      initialBook={bookId}
      initialChapter={chapter}
      initialVerse={verse}
    />
  );

  const CustomNavigation2 = (
    <CustomNavigation
      setNavigation={setNavigation2}
      initialBook={bookId}
      initialChapter={chapter}
      initialVerse={verse}
    />
  );

  return (
    <>

      {(layout > 0 && layout <= 2) && (
        <>
          {(openResource1 === false || openResource2 === false) && (
            <div className="m-3 ml-0 rounded-md overflow-hidden  pb-4">
              <>
                <EditorSection
                  row="1"
                  CustomNavigation={CustomNavigation1}
                  hideAddition={hideAddition}
                  sectionNum={sectionNum}
                  setSectionNum={setSectionNum}
                  title={referenceColumnOneData1.refName}
                  selectedResource={referenceColumnOneData1.selectedResource}
                  languageId={referenceColumnOneData1.languageId}
                  setReferenceResources={setReferenceColumnOneData1}
                  setLoadResource={setLoadResource1}
                  loadResource={loadResource1}
                  openResource={openResource1}
                  setOpenResource1={setOpenResource1}
                  setOpenResource2={setOpenResource2}
                >
                  {
              (loadResource1 === true) && (
              referenceColumnOneData1.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnOneData1.languageId}
                  refName={referenceColumnOneData1.refName}
                  bookId={_bookId1}
                  chapter={_chapter1}
                  verse={_verse1}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnOneData1.selectedResource}
                  languageId={referenceColumnOneData1.languageId}
                  bookId={_bookId1}
                  chapter={_chapter1}
                  verse={_verse1}
                />
              ))
            }
                </EditorSection>
              </>
              <>
                <EditorSection
                  row="2"
                  hideAddition={hideAddition}
                  sectionNum={sectionNum}
                  setSectionNum={setSectionNum}
                  title={referenceColumnOneData2.refName}
                  selectedResource={referenceColumnOneData2.selectedResource}
                  languageId={referenceColumnOneData2.languageId}
                  setReferenceResources={setReferenceColumnOneData2}
                  setLoadResource={setLoadResource2}
                  loadResource={loadResource2}
                  openResource={openResource2}
                  setOpenResource1={setOpenResource1}
                  setOpenResource2={setOpenResource2}
                  CustomNavigation={CustomNavigation2}
                >
                  {
              (loadResource2 === true) && (
              referenceColumnOneData2.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnOneData2.languageId}
                  refName={referenceColumnOneData2.refName}
                  bookId={_bookId2}
                  chapter={_chapter2}
                  verse={_verse2}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnOneData2.selectedResource}
                  languageId={referenceColumnOneData2.languageId}
                  bookId={_bookId2}
                  chapter={_chapter2}
                  verse={_verse2}
                />
              ))
            }
                </EditorSection>
                <EditorSection
                  row="1"
                  CustomNavigation={CustomNavigation1}
                  hideAddition={hideAddition}
                  sectionNum={sectionNum}
                  setSectionNum={setSectionNum}
                  title={referenceColumnOneData1.refName}
                  selectedResource={referenceColumnOneData1.selectedResource}
                  languageId={referenceColumnOneData1.languageId}
                  setReferenceResources={setReferenceColumnOneData1}
                  setLoadResource={setLoadResource1}
                  loadResource={loadResource1}
                  openResource={openResource1}
                  setOpenResource1={setOpenResource1}
                  setOpenResource2={setOpenResource2}
                >
                  {
              (loadResource1 === true) && (
              referenceColumnOneData1.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnOneData1.languageId}
                  refName={referenceColumnOneData1.refName}
                  bookId={_bookId1}
                  chapter={_chapter1}
                  verse={_verse1}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnOneData1.selectedResource}
                  languageId={referenceColumnOneData1.languageId}
                  bookId={_bookId1}
                  chapter={_chapter1}
                  verse={_verse1}
                />
              ))
            }
                </EditorSection>
              </>
            </div>
        )}
        </>
      )}
    </>
  );
};
export default SectionPlaceholder1;
