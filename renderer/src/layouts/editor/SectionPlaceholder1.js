/* eslint-disable react/jsx-no-useless-fragment */
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import localforage from 'localforage';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import EditorSection from '@/layouts/editor/EditorSection';
import ReferenceBible from '@/components/EditorPage/Reference/ReferenceBible/ReferenceBible';
import { ProjectContext } from '@/components/context/ProjectContext';
import CustomNavigation from '@/components/EditorPage/Navigation/CustomNavigation';
import { saveReferenceResource } from '@/core/projects/updateAgSettings';
import NavigationObs from '@/components/EditorPage/ObsEditor/NavigationObs';
import ReferenceObs from '@/components/EditorPage/ObsEditor/ReferenceObs';
import { isElectron } from '@/core/handleElectron';
import core from '@/components/EditorPage/ObsEditor/core';
import ReferenceAudio from '@/components/EditorPage/Reference/Audio/ReferenceAudio';

const TranslationHelps = dynamic(
  () => import('@/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);

const SectionPlaceholder1 = ({ editor }) => {
  const supportedBooks = null;
  const [referenceColumnOneData1, setReferenceColumnOneData1] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
    owner: '',
  });
  const [referenceColumnOneData2, setReferenceColumnOneData2] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
    owner: '',
  });
  const [loadResource1, setLoadResource1] = useState(false);
  const [loadResource2, setLoadResource2] = useState(false);
  const {
    state: {
      layout,
      openResource1,
      openResource2,
      bookId,
      chapter,
      verse,
      obsNavigation,
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
  const [removingSection, setRemovingSection] = useState();
  const [addingSection, setAddingSection] = useState();
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
      Object.entries(value).forEach(
        ([, _value]) => {
          Object.entries(_value).forEach(
            ([, resources]) => {
              if (resources.identification.name.en === _projectname[0]) {
                refsHistory.push(resources.project[resources.type.flavorType.flavor.name].refResources);
              }
            },
          );
        },
      );
    }).then(() => {
      if (refsHistory[0]) {
        Object.entries(refsHistory[0]).forEach(
          ([_columnnum, _value]) => {
          if (_columnnum === '0' && _value) {
            Object.entries(_value).forEach(
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
                        owner: _value?.owner,
                      });
                  }
                  if (_rownum === '2') {
                      setReferenceColumnOneData2({
                        languageId: _value?.language,
                        selectedResource: _value?.resouceId,
                        refName: _value?.name,
                        header: _value?.name,
                        owner: _value?.owner,
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
        let refs = refsHistory[0];
        refs = refs.filter((x) => x != null);
        setLayout(refs.length);
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
        ([, _value]) => {
          Object?.entries(_value).forEach(
            ([, resources]) => {
              if (resources.identification.name.en === _projectname[0]) {
                refsHistory.push(resources.project[resources.type.flavorType.flavor.name].refResources);
                if (sectionNum === 1 || sectionNum === 0) {
                  if (openResource1 && openResource2) {
                      resources.project[resources.type.flavorType.flavor.name].refResources.splice(0, 1);
                    }
                }
                if (sectionNum === 1 && layout > 0 && !(openResource1 && openResource2)) {
                  resources.project[resources.type.flavorType.flavor.name].refResources[0] = {
                      1: {
                        resouceId: referenceColumnOneData1?.selectedResource,
                        language: referenceColumnOneData1?.languageId,
                        name: referenceColumnOneData1?.refName,
                        owner: referenceColumnOneData1?.owner,
                        navigation: { book: '1TI', chapter: '1' },
                      },
                    };
                }
                if (sectionNum === 2 && layout > 0) {
                  if (referenceColumnOneData1.refName !== undefined) {
                    resources.project[resources.type.flavorType.flavor.name].refResources[0] = {
                    1: {
                      resouceId: referenceColumnOneData1?.selectedResource,
                      language: referenceColumnOneData1?.languageId,
                      name: referenceColumnOneData1?.refName,
                      owner: referenceColumnOneData1?.owner,
                      navigation: { book: '1TI', chapter: '1' },
                    },
                    2: {
                      resouceId: referenceColumnOneData2?.selectedResource,
                      language: referenceColumnOneData2?.languageId,
                      name: referenceColumnOneData2?.refName,
                      owner: referenceColumnOneData2?.owner,
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
      if (!openResource1 || !openResource2 || addingSection <= 2 || removingSection <= 2) {
        setRemovingSection();
        setAddingSection();
        localforage.setItem('projectmeta', value).then(() => {
          saveReferenceResource();
        });
      }
    });
  });
  }, [openResource1, openResource2, referenceColumnOneData1?.languageId, referenceColumnOneData1.refName,
    referenceColumnOneData1?.selectedResource, referenceColumnOneData2?.languageId, referenceColumnOneData2?.refName,
    referenceColumnOneData2?.selectedResource, sectionNum, layout, referenceColumnOneData1,
    referenceColumnOneData2?.owner, removingSection, addingSection]);

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
  const [obsNavigation1, setObsNavigation1] = useState(1);
  const [obsNavigation2, setObsNavigation2] = useState(1);
  const [stories1, setStories1] = useState();
  const [stories2, setStories2] = useState();
  const _obsNavigation1 = scrollLock === false ? obsNavigation : obsNavigation1;
  const _obsNavigation2 = scrollLock === false ? obsNavigation : obsNavigation2;
  const ObsNavigation1 = (
    <NavigationObs
      onChangeNumber={(value) => setObsNavigation1(value)}
      number={obsNavigation1}
    />
  );
  const ObsNavigation2 = (
    <NavigationObs
      onChangeNumber={(value) => setObsNavigation2(value)}
      number={obsNavigation2}
    />
  );
  useEffect(() => {
    if (isElectron()) {
      localforage.getItem('userProfile').then((user) => {
        const fs = window.require('fs');
        if (_obsNavigation1 && referenceColumnOneData1.refName && referenceColumnOneData1.selectedResource === 'obs') {
          setStories1(core(fs, _obsNavigation1, referenceColumnOneData1.refName, user.username));
        }
        if (_obsNavigation2 && referenceColumnOneData2.refName && referenceColumnOneData2.selectedResource === 'obs') {
          setStories2(core(fs, _obsNavigation2, referenceColumnOneData2.refName, user.username));
        }
      });
    }
  }, [_obsNavigation1, _obsNavigation2, referenceColumnOneData1, referenceColumnOneData2]);
  return (
    <>
      {(layout > 0 && layout <= 2) && (
        <>
          {(openResource1 === false || openResource2 === false) && (
            <div className={`bg-white rounded-md grid gap-2 ${editor === 'audioTranslation' ? 'lg:max-h-[30rem] md:max-h-[24rem]' : 'h-editor'} overflow-x-auto`}>
              <EditorSection
                row="1"
                CustomNavigation={(referenceColumnOneData1.selectedResource).lastIndexOf('obs', 0) === 0 ? ObsNavigation1 : CustomNavigation1}
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
                setRemovingSection={setRemovingSection}
                setAddingSection={setAddingSection}
              >
                {
              (loadResource1 === true)
              && ((referenceColumnOneData1.selectedResource === 'bible' && (
                <ReferenceBible
                  languageId={referenceColumnOneData1.languageId}
                  refName={referenceColumnOneData1.refName}
                  bookId={_bookId1}
                  chapter={_chapter1}
                  verse={_verse1}
                />
              )) || (referenceColumnOneData1.selectedResource === 'obs' && (
                <ReferenceObs
                  stories={stories1}
                />
                )) || (referenceColumnOneData1.selectedResource === 'audio' && (
                <ReferenceAudio
                  languageId={referenceColumnOneData1.languageId}
                  refName={referenceColumnOneData1.refName}
                  bookId={_bookId1}
                  chapter={_chapter1}
                  verse={_verse1}
                />
                )) || (
                  <TranslationHelps
                    selectedResource={referenceColumnOneData1.selectedResource}
                    languageId={referenceColumnOneData1.languageId}
                    owner={referenceColumnOneData1.owner}
                    bookId={_bookId1}
                    chapter={_chapter1}
                    verse={_verse1}
                    story={_obsNavigation1}
                  />
                )
              )
            }
              </EditorSection>

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
                CustomNavigation={(referenceColumnOneData2.selectedResource).lastIndexOf('obs', 0) === 0 ? ObsNavigation2 : CustomNavigation2}
                setRemovingSection={setRemovingSection}
                setAddingSection={setAddingSection}
              >
                {
              (loadResource2 === true)
              && ((referenceColumnOneData2.selectedResource === 'bible' && (
                <ReferenceBible
                  languageId={referenceColumnOneData2.languageId}
                  refName={referenceColumnOneData2.refName}
                  bookId={_bookId2}
                  chapter={_chapter2}
                  verse={_verse2}
                />
                )) || (referenceColumnOneData2.selectedResource === 'obs' && (
                  <ReferenceObs
                    stories={stories2}
                  />
                )) || (referenceColumnOneData1.selectedResource === 'audio' && (
                <ReferenceAudio
                  languageId={referenceColumnOneData1.languageId}
                  refName={referenceColumnOneData1.refName}
                  bookId={_bookId1}
                  chapter={_chapter1}
                  verse={_verse1}
                />
                )) || (
                  <TranslationHelps
                    selectedResource={referenceColumnOneData2.selectedResource}
                    languageId={referenceColumnOneData2.languageId}
                    owner={referenceColumnOneData2.owner}
                    bookId={_bookId2}
                    chapter={_chapter2}
                    verse={_verse2}
                    story={_obsNavigation2}
                  />
                )
              )
            }
              </EditorSection>
            </div>
        )}
        </>
      )}
    </>
  );
};
export default SectionPlaceholder1;
