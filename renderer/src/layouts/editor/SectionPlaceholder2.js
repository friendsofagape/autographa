/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import localforage from 'localforage';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import EditorSection from '@/layouts/editor/EditorSection';
import ReferenceBible from '@/components/EditorPage/Reference/ReferenceBible/ReferenceBible';
import { ProjectContext } from '@/components/context/ProjectContext';
import CustomNavigation from '@/components/EditorPage/Navigation/CustomNavigation';
import { isElectron } from '@/core/handleElectron';
import { updateAgSettings } from '@/core/projects/updateAgSettings';

const TranslationHelps = dynamic(
  () => import('@/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);

const SectionPlaceholder2 = () => {
  const supportedBooks = null;
  const [referenceColumnTwoData1, setReferenceColumnTwoData1] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
    owner: '',
  });
  const [referenceColumnTwoData2, setReferenceColumnTwoData2] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
    owner: '',
  });
  const [loadResource3, setLoadResource3] = useState(false);
  const [loadResource4, setLoadResource4] = useState(false);

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
      setOpenResource3,
      setOpenResource4,
      applyBooksFilter,
      setLayout,
    },
  } = useContext(ReferenceContext);
  const {
    states: {
      selectedProject,
      scrollLock,
    },
    actions: {
      setSelectedProject,
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
    if (layout > 0 && layout <= 2) {
      setRow(0);
      if (sectionNum === 0) { setSectionNum(1); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  useEffect(() => {
    applyBooksFilter(supportedBooks);
  }, [applyBooksFilter, supportedBooks]);

  useEffect(() => {
    const refsHistory = [];
    const rows = [];
    localforage.getItem('currentProject').then((projectName) => {
    const _projectname = projectName?.split('_');
    localforage.getItem('projectmeta').then((value) => {
      Object.entries(value).forEach(
        ([_columnnum, _value]) => {
          Object.entries(_value).forEach(
            ([_rownum, resources]) => {
              if (resources.project?.textTranslation?.projectName === _projectname[0]) {
                refsHistory.push(resources.project.textTranslation.refResources);
              }
            },
          );
        },
      );
    }).then(() => {
      if (refsHistory[0]) {
        Object.entries(refsHistory[0]).forEach(
          ([_columnnum, _value]) => {
          if (_columnnum === '1' && _value) {
            Object.entries(_value).forEach(
              ([_rownum, _value]) => {
                rows.push(_rownum);
                if (_rownum === '1') {
                    setReferenceColumnTwoData1({
                      languageId: _value?.language,
                      selectedResource: _value?.resouceId,
                      refName: _value?.name,
                      header: _value?.name,
                    });
                }
                if (_rownum === '2') {
                    setReferenceColumnTwoData2({
                      languageId: _value?.language,
                      selectedResource: _value?.resouceId,
                      refName: _value?.name,
                      header: _value?.name,
                    });
                }
              },
            );
          }
        },
      );
      }
    }).then(() => {
      if (rows.length > 1) {
        setLoadResource3(true);
        setLoadResource4(true);
        setOpenResource3(false);
        setOpenResource4(false);
      }
      if (rows.length === 1) {
        setLoadResource3(true);
        setOpenResource3(false);
      }
      setSectionNum(rows.length);
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
    if (openResource1 === true && openResource2 === true
      && openResource3 === true && openResource4 === true) {
      if (layout === 1) {
        setLayout(0);
      }
    }
  }, [layout, openResource1, openResource2, openResource3, openResource4, sectionNum, setLayout]);

  useEffect(() => {
    const refsHistory = [];
    localforage.getItem('currentProject').then((projectName) => {
      const _projectname = projectName?.split('_');
    localforage.getItem('projectmeta').then((value) => {
      Object.entries(value).forEach(
        ([_columnnum, _value]) => {
          Object.entries(_value).forEach(
            ([_rownum, resources]) => {
              if (resources.identification.name.en === _projectname[0]) {
                refsHistory.push(resources.project.textTranslation);
                if (sectionNum === 1 || sectionNum === 0) {
                  if (openResource3
                    && openResource4) {
                      resources.project.textTranslation.refResources.splice(1, 1);
                    }
                }
                if (sectionNum === 1) {
                  if (openResource3 === false
                    || openResource4 === false) {
                      resources.project.textTranslation.refResources[1] = {
                      1: {
                        resouceId: referenceColumnTwoData1?.selectedResource,
                        language: referenceColumnTwoData1?.languageId,
                        name: referenceColumnTwoData1?.refName,
                        navigation: { book: '1TI', chapter: '1' },
                      },
                    };
                  }
                }
                if (sectionNum === 2) {
                  resources.project.textTranslation.refResources[1] = {
                    1: {
                      resouceId: referenceColumnTwoData1?.selectedResource,
                      language: referenceColumnTwoData1?.languageId,
                      name: referenceColumnTwoData1?.refName,
                      navigation: { book: '1TI', chapter: '1' },
                    },
                    2: {
                      resouceId: referenceColumnTwoData2?.selectedResource,
                      language: referenceColumnTwoData2?.languageId,
                      name: referenceColumnTwoData2?.refName,
                      navigation: { book: '1TI', chapter: '1' },
                    },
                  };
                }
              }
            },
          );
        },
      );
    localforage.setItem('projectmeta', value).then(() => {
      Object.entries(value).forEach(
        ([_columnnum, _value]) => {
          Object.entries(_value).forEach(
            ([_rownum, resources]) => {
              if (resources.identification.name.en === _projectname[0]) {
                localforage.getItem('userProfile').then((value) => {
                  updateAgSettings(value?.username, projectName, resources);
                });
              }
            },
          );
          },
      );
    });
    });
  });
  });

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
      {((openResource1 === true && openResource2 === true)
      ? (layout >= 1 && layout <= 2) : (layout > 1 && layout <= 2)) && (
      <>
        {(openResource3 === false || openResource4 === false) && (
        <div className="bg-white rounded-md grid gap-2 h-editor overflow-x-auto">
          <EditorSection
            row="3"
            hideAddition={hideAddition}
            sectionNum={sectionNum}
            setSectionNum={setSectionNum}
            title={referenceColumnTwoData1.refName}
            selectedResource={referenceColumnTwoData1.selectedResource}
            languageId={referenceColumnTwoData1.languageId}
            owner={referenceColumnTwoData1.owner}
            setReferenceResources={setReferenceColumnTwoData1}
            setLoadResource={setLoadResource3}
            loadResource={loadResource3}
            openResource={openResource3}
            setOpenResource3={setOpenResource3}
            setOpenResource4={setOpenResource4}
            CustomNavigation={CustomNavigation1}
          >
            {
              (loadResource3 === true) && (
              referenceColumnTwoData1.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnTwoData1.languageId}
                  refName={referenceColumnTwoData1.refName}
                  bookId={_bookId1}
                  chapter={_chapter1}
                  verse={_verse1}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnTwoData1.selectedResource}
                  languageId={referenceColumnTwoData1.languageId}
                  owner={referenceColumnTwoData1.owner}
                  bookId={_bookId1}
                  chapter={_chapter1}
                  verse={_verse1}
                />
              ))
            }
          </EditorSection>
          <EditorSection
            row="4"
            hideAddition={hideAddition}
            sectionNum={sectionNum}
            setSectionNum={setSectionNum}
            title={referenceColumnTwoData2.refName}
            selectedResource={referenceColumnTwoData2.selectedResource}
            languageId={referenceColumnTwoData2.languageId}
            owner={referenceColumnTwoData2.owner}
            setReferenceResources={setReferenceColumnTwoData2}
            setLoadResource={setLoadResource4}
            loadResource={loadResource4}
            openResource={openResource4}
            setOpenResource3={setOpenResource3}
            setOpenResource4={setOpenResource4}
            CustomNavigation={CustomNavigation2}
          >
            {
              (loadResource4 === true) && (
              referenceColumnTwoData2.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnTwoData2.languageId}
                  refName={referenceColumnTwoData2.refName}
                  bookId={_bookId2}
                  chapter={_chapter2}
                  verse={_verse2}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnTwoData2.selectedResource}
                  languageId={referenceColumnTwoData2.languageId}
                  owner={referenceColumnTwoData2.owner}
                  bookId={_bookId2}
                  chapter={_chapter2}
                  verse={_verse2}
                />
              ))
            }
          </EditorSection>
        </div>
      )}
      </>
      )}
    </>
  );
};
export default SectionPlaceholder2;
