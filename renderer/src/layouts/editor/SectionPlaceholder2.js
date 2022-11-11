/* eslint-disable react/jsx-no-useless-fragment */
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import localforage from 'localforage';
import PropTypes from 'prop-types';
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

const SectionPlaceholder2 = ({ editor }) => {
  const supportedBooks = null;
  const [referenceColumnTwoData1, setReferenceColumnTwoData1] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
    owner: '',
    offlineResource: { offline: false },
  });
  const [referenceColumnTwoData2, setReferenceColumnTwoData2] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
    owner: '',
    offlineResource: { offline: false },
  });
  const [loadResource3, setLoadResource3] = useState(false);
  const [loadResource4, setLoadResource4] = useState(false);
  const [removingSection, setRemovingSection] = useState();
  const [addingSection, setAddingSection] = useState();
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
      obsNavigation,
      resetResourceOnDeleteOffline,
    },
    actions: {
      setRow,
      setOpenResource3,
      setOpenResource4,
      applyBooksFilter,
      setLayout,
      setResetResourceOnDeleteOffline,
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
    if (layout > 0 && layout <= 2) {
      setRow(0);
      if (sectionNum === 0) { setSectionNum(1); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  useEffect(() => {
    applyBooksFilter(supportedBooks);
  }, [applyBooksFilter, supportedBooks]);

  // reset panes on delete offline contents
  useEffect(() => {
    if (resetResourceOnDeleteOffline?.referenceColumnTwoData1Reset) {
      setReferenceColumnTwoData1((prev) => ({
        ...prev,
        languageId: '',
        selectedResource: '',
        refName: '',
        header: '',
        owner: '',
        offlineResource: { offline: false },
      }
      ));
      setResetResourceOnDeleteOffline((prev) => ({
        ...prev,
        referenceColumnTwoData1Reset: false,
      }
      ));
    } else if (resetResourceOnDeleteOffline?.referenceColumnTwoData2Reset) {
      setReferenceColumnTwoData2((prev) => ({
        ...prev,
        languageId: '',
        selectedResource: '',
        refName: '',
        header: '',
        owner: '',
        offlineResource: { offline: false },
      }
      ));
      setResetResourceOnDeleteOffline((prev) => ({
        ...prev,
        referenceColumnTwoData2Reset: false,
      }
      ));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetResourceOnDeleteOffline?.referenceColumnTwoData1Reset, resetResourceOnDeleteOffline?.referenceColumnTwoData2Reset]);

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
          if (_columnnum === '1' && _value) {
            Object.entries(_value).forEach(
              ([_rownum, _value]) => {
                rows.push(_rownum);
                // if (openResource3 === false || openResource4 === false) {
                  if (_rownum === '1') {
                      setReferenceColumnTwoData1({
                        ...referenceColumnTwoData1,
                        languageId: _value?.language,
                        selectedResource: _value?.resouceId,
                        refName: _value?.name,
                        header: _value?.name,
                        owner: _value?.owner,
                        offlineResource: _value?.offline,
                      });
                  }
                  if (_rownum === '2') {
                      setReferenceColumnTwoData2({
                        ...referenceColumnTwoData2,
                        languageId: _value?.language,
                        selectedResource: _value?.resouceId,
                        refName: _value?.name,
                        header: _value?.name,
                        owner: _value?.owner,
                        offlineResource: _value?.offline,
                      });
                  }
                // }
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
        ([, _value]) => {
          Object.entries(_value).forEach(
            ([, resources]) => {
              if (resources.identification.name.en === _projectname[0]) {
                refsHistory.push(resources.project[resources.type.flavorType.flavor.name]);
                if (sectionNum === 1 || sectionNum === 0) {
                  if (openResource3
                    && openResource4) {
                      resources.project[resources.type.flavorType.flavor.name].refResources.splice(1, 1);
                    }
                }
                if (sectionNum === 1 && layout > 1 && !(openResource3 && openResource4)) {
                      resources.project[resources.type.flavorType.flavor.name].refResources[1] = {
                      1: {
                        resouceId: referenceColumnTwoData1?.selectedResource,
                        language: referenceColumnTwoData1?.languageId,
                        name: referenceColumnTwoData1?.refName,
                        owner: referenceColumnTwoData1?.owner,
                        navigation: { book: '1TI', chapter: '2' },
                        offline: referenceColumnTwoData1.offlineResource,
                      },
                  };
                }
                if (sectionNum === 2 && layout > 1) {
                  if (referenceColumnTwoData1.refName !== undefined) {
                  resources.project[resources.type.flavorType.flavor.name].refResources[1] = {
                    1: {
                      resouceId: referenceColumnTwoData1?.selectedResource,
                      language: referenceColumnTwoData1?.languageId,
                      name: referenceColumnTwoData1?.refName,
                      owner: referenceColumnTwoData1?.owner,
                      navigation: { book: '1TI', chapter: '2' },
                      offline: referenceColumnTwoData1.offlineResource,
                    },
                    2: {
                      resouceId: referenceColumnTwoData2?.selectedResource,
                      language: referenceColumnTwoData2?.languageId,
                      name: referenceColumnTwoData2?.refName,
                      owner: referenceColumnTwoData2?.owner,
                      navigation: { book: '1TI', chapter: '2' },
                      offline: referenceColumnTwoData2.offlineResource,
                    },
                  };
                }
                }
                if (layout === 0 && openResource1 && openResource2 && openResource3 && openResource4) {
                  resources.project[resources.type.flavorType.flavor.name].refResources = [];
                }
              }
            },
          );
        },
      );
      if (addingSection >= 3 || !openResource3 || !openResource4 || removingSection >= 3) {
        setRemovingSection();
        setAddingSection();
        localforage.setItem('projectmeta', value).then(() => {
          saveReferenceResource();
        });
      }
  });
  });
  }, [openResource1, openResource2, openResource3, openResource4, referenceColumnTwoData1?.languageId,
    referenceColumnTwoData1.refName, referenceColumnTwoData1?.selectedResource, referenceColumnTwoData2?.languageId,
    referenceColumnTwoData2?.refName, referenceColumnTwoData2?.selectedResource, sectionNum, layout,
    referenceColumnTwoData1?.owner, referenceColumnTwoData2?.owner, removingSection, addingSection,
    referenceColumnTwoData1.offlineResource, referenceColumnTwoData2.offlineResource,
    resetResourceOnDeleteOffline?.referenceColumnTwoData1Reset, resetResourceOnDeleteOffline?.referenceColumnTwoData2Reset]);

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
        if (_obsNavigation1 && referenceColumnTwoData1.refName && referenceColumnTwoData1.selectedResource === 'obs') {
          setStories1(core(fs, _obsNavigation1, referenceColumnTwoData1.refName, user.username));
        }
        if (_obsNavigation2 && referenceColumnTwoData2.refName && referenceColumnTwoData2.selectedResource === 'obs') {
          setStories2(core(fs, _obsNavigation2, referenceColumnTwoData2.refName, user.username));
        }
      });
    }
  }, [_obsNavigation1, _obsNavigation2, referenceColumnTwoData1, referenceColumnTwoData2]);
  return (
    <>
      {((openResource1 === true && openResource2 === true)
      ? (layout >= 1 && layout <= 2) : (layout > 1 && layout <= 2)) && (
      <>
        {(openResource3 === false || openResource4 === false) && (
        <div className={`bg-white rounded-md grid gap-2 ${editor === 'audioTranslation' ? 'md:max-h-[64vh] lg:max-h-[70vh]' : 'h-editor'} overflow-x-auto`}>
          <EditorSection
            row="3"
            hideAddition={hideAddition}
            sectionNum={sectionNum}
            setSectionNum={setSectionNum}
            title={referenceColumnTwoData1.refName}
            selectedResource={referenceColumnTwoData1.selectedResource}
            languageId={referenceColumnTwoData1.languageId}
            referenceResources={referenceColumnTwoData1}
            setReferenceResources={setReferenceColumnTwoData1}
            setLoadResource={setLoadResource3}
            loadResource={loadResource3}
            openResource={openResource3}
            setOpenResource3={setOpenResource3}
            setOpenResource4={setOpenResource4}
            CustomNavigation={(referenceColumnTwoData1.selectedResource).lastIndexOf('obs', 0) === 0 ? ObsNavigation1 : CustomNavigation1}
            setRemovingSection={setRemovingSection}
            setAddingSection={setAddingSection}
          >
            {
              (loadResource3 === true)
              && ((referenceColumnTwoData1.selectedResource === 'bible' && (
                <>
                    {referenceColumnTwoData1?.languageId
                  && (
                  <ReferenceBible
                    languageId={referenceColumnTwoData1.languageId}
                    refName={referenceColumnTwoData1.refName}
                    bookId={_bookId1}
                    chapter={_chapter1}
                    verse={_verse1}
                  />
                )}
                </>
              )) || (referenceColumnTwoData1.selectedResource === 'obs' && (
                <>
                    {referenceColumnTwoData1?.languageId
                  && (
                  <ReferenceObs
                    stories={stories1}
                  />
                  )}
                </>
                )) || (referenceColumnTwoData1.selectedResource === 'audio' && (
                <ReferenceAudio
                  languageId={referenceColumnTwoData1.languageId}
                  refName={referenceColumnTwoData1.refName}
                  bookId={_bookId1}
                  chapter={_chapter1}
                  verse={_verse1}
                />
                )) || (
                  <TranslationHelps
                    selectedResource={referenceColumnTwoData1.selectedResource}
                    languageId={referenceColumnTwoData1.languageId}
                    owner={referenceColumnTwoData1.owner}
                    bookId={_bookId1}
                    chapter={_chapter1}
                    verse={_verse1}
                    story={_obsNavigation1}
                    offlineResource={referenceColumnTwoData1.offlineResource}
                  />
                )
              )
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
            referenceResources={referenceColumnTwoData2}
            setReferenceResources={setReferenceColumnTwoData2}
            setLoadResource={setLoadResource4}
            loadResource={loadResource4}
            openResource={openResource4}
            setOpenResource3={setOpenResource3}
            setOpenResource4={setOpenResource4}
            CustomNavigation={(referenceColumnTwoData2.selectedResource).lastIndexOf('obs', 0) === 0 ? ObsNavigation2 : CustomNavigation2}
            setRemovingSection={setRemovingSection}
            setAddingSection={setAddingSection}
          >
            {
              (loadResource4 === true)
              && ((referenceColumnTwoData2.selectedResource === 'bible' && (
                <>
                  {referenceColumnTwoData2?.languageId
            && (
              <ReferenceBible
                languageId={referenceColumnTwoData2.languageId}
                refName={referenceColumnTwoData2.refName}
                bookId={_bookId2}
                chapter={_chapter2}
                verse={_verse2}
              />
                )}
                </>
              )) || (referenceColumnTwoData2.selectedResource === 'obs' && (
                <>
                  {referenceColumnTwoData2?.languageId
              && (
                <ReferenceObs
                  stories={stories2}
                />
              )}
                </>
                )) || (referenceColumnTwoData2.selectedResource === 'audio' && (
                <ReferenceAudio
                  languageId={referenceColumnTwoData2.languageId}
                  refName={referenceColumnTwoData2.refName}
                  bookId={_bookId1}
                  chapter={_chapter1}
                  verse={_verse1}
                />
                )) || (
                  <TranslationHelps
                    selectedResource={referenceColumnTwoData2.selectedResource}
                    languageId={referenceColumnTwoData2.languageId}
                    owner={referenceColumnTwoData2.owner}
                    bookId={_bookId2}
                    chapter={_chapter2}
                    verse={_verse2}
                    story={_obsNavigation2}
                    offlineResource={referenceColumnTwoData2.offlineResource}
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
export default SectionPlaceholder2;

SectionPlaceholder2.propTypes = {
  editor: PropTypes.string,
};
