import { ReferenceContext } from '@/components/context/ReferenceContext';
import EditorSection from '@/layouts/editor/EditorSection';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import ReferenceBible from '@/components/EditorPage/Reference/ReferenceBible/ReferenceBible';
import localforage from 'localforage';

const TranslationHelps = dynamic(
  () => import('@/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);

const SectionPlaceholder1 = () => {
  const [referenceColumnOneData1, setReferenceCoulumnOneData1] = useState({
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
  const [sectionNum, setSectionNum] = useState(0);

  useEffect(() => {
    if (layout > 0 && layout <= 2) {
      setRow(0);
      if (sectionNum === 0) { setSectionNum(1); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  // useEffect(() => {
  //   if (layout === 0 && layout < 2) {
  //     setRow(0);
  //   }
  //   setSectionNum(layout);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [layout]);

  useEffect(() => {
    const refsHistory = [];
    localforage.getItem('projectmeta').then((value) => {
      refsHistory.push(value.projects[0].project.textTranslation.refResources);
    }).then(() => {
      if (refsHistory[0]) {
        Object.entries(refsHistory[0]).forEach(
          ([_columnnum, _value]) => {
          // console.log('_columnnum', _columnnum, 'columndata', _value);
          if (_columnnum === '0') {
            Object.entries(_value).forEach(
              ([_rownum, _value]) => {
                console.log('col1', '_rownum', _rownum, '_value', _value);
              },
            );
          }
          if (_columnnum === '0') {
            Object.entries(_value).forEach(
            ([_rownum, _value]) => {
              console.log('col2', '_rownum', _rownum, '_value', _value);
            },
          );
          }
        },
      );
      }
      setLayout(refsHistory[0].length);
      setSectionNum(2);

      setLoadResource1(true);
      setLoadResource2(true);

      setOpenResource1(false);
      setOpenResource2(false);

      setReferenceCoulumnOneData1({
        languageId: 'English',
        selectedResource: 'bible',
        refName: 'English-ULB',
        header: 'bible',
      });

      setReferenceColumnOneData2({
        languageId: 'hi',
        selectedResource: 'tn',
        refName: '',
        header: '',
      });
    });
  }, []);

  console.log(sectionNum);

  return (
    <>

      {(layout > 0 && layout <= 2) && (
        <>
          <div className="m-3 rounded-md overflow-hidden  pb-4">
            {(sectionNum > 0 && sectionNum <= 2) && (
              <>
                <EditorSection
                  row="1"
                  sectionNum={sectionNum}
                  setSectionNum={setSectionNum}
                  title={referenceColumnOneData1.header === 'Notes' ? 'Translation Notes' : referenceColumnOneData1.header}
                  selectedResource={referenceColumnOneData1.selectedResource}
                  setReferenceResources={setReferenceCoulumnOneData1}
                  languageId={referenceColumnOneData1.languageId}
                  setLoadResource={setLoadResource1}
                  loadResource={loadResource1}
                  openResource={openResource1}
                  setOpenResource1={setOpenResource1}
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
                // refName={referenceColumnOneData.refName}
                />
              )
            )
          }
                </EditorSection>
              </>
          )}
            {(sectionNum > 1 && sectionNum <= 2) && (
              <>
                <EditorSection
                  row="2"
                  sectionNum={sectionNum}
                  setSectionNum={setSectionNum}
                  title={referenceColumnOneData2.header === 'Notes' ? 'Translation Notes' : referenceColumnOneData2.header}
                  selectedResource={referenceColumnOneData2.selectedResource}
                  languageId={referenceColumnOneData2.languageId}
                  setReferenceResources={setReferenceColumnOneData2}
                  setLoadResource={setLoadResource2}
                  loadResource={loadResource2}
                  openResource={openResource2}
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
            )}
          </div>
        </>
      )}
    </>
  );
};
export default SectionPlaceholder1;
