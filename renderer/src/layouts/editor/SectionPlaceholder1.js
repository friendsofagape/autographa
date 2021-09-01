/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { ReferenceContext } from '@/components/context/ReferenceContext';
import EditorSection from '@/layouts/editor/EditorSection';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import ReferenceBible from '@/components/EditorPage/Reference/ReferenceBible/ReferenceBible';
import localforage from 'localforage';
import { ProjectContext } from '@/components/context/ProjectContext';

const TranslationHelps = dynamic(
  () => import('@/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);

const SectionPlaceholder1 = () => {
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
    },
    actions: {
      setRow,
      setLayout,
      setOpenResource1,
      setOpenResource2,
    },
  } = useContext(ReferenceContext);
  const {
    states: {
      selectedProject,
    },
  } = useContext(ProjectContext);
  const [sectionNum, setSectionNum] = useState(0);
  const [hideAddition, setHideAddition] = useState(true);

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
    localforage.getItem('projectmeta').then((value) => {
      Object.entries(value).forEach(
        ([_columnnum, _value]) => {
          Object.entries(_value).forEach(
            ([_rownum, resources]) => {
              if (resources.identification.name.en === selectedProject) {
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
          if (_columnnum === '0') {
            Object.entries(_value).forEach(
              ([_rownum, _value]) => {
                rows.push(_rownum);
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
              },
            );
          }
        },
      );
      }
    }).then(() => {
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
    localforage.getItem('projectmeta').then((value) => {
      Object.entries(value).forEach(
        ([_columnnum, _value]) => {
          Object.entries(_value).forEach(
            ([_rownum, resources]) => {
              if (resources.identification.name.en === selectedProject) {
                refsHistory.push(resources.project.textTranslation.refResources);
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

  return (
    <>

      {(layout > 0 && layout <= 2) && (
        <>
          {(openResource1 === false || openResource2 === false) && (
            <div className="m-3 ml-0 rounded-md overflow-hidden  pb-4">
              <>
                <EditorSection
                  row="1"
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
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnOneData1.selectedResource}
                  languageId={referenceColumnOneData1.languageId}
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
                >
                  {
              (loadResource2 === true) && (
              referenceColumnOneData2.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnOneData2.languageId}
                  refName={referenceColumnOneData2.refName}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnOneData2.selectedResource}
                  languageId={referenceColumnOneData2.languageId}
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
