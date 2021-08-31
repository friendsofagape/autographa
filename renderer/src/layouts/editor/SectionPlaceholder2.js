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

const SectionPlaceholder2 = () => {
  const [referenceColumnTwoData1, setReferenceColumnTwoData1] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
  });
  const [referenceColumnTwoData2, setReferenceColumnTwoData2] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
  });
  const [loadResource3, setLoadResource3] = useState(false);
  const [loadResource4, setLoadResource4] = useState(false);
  // const [ showRow1, setShowRow1 ] = useState(false)
  const {
    state: {
      layout,
      openResource1,
      openResource2,
      openResource3,
      openResource4,
    },
    actions: {
      setRow,
      setLayout,
      setOpenResource3,
      setOpenResource4,
    },
  } = useContext(ReferenceContext);
  const [sectionNum, setSectionNum] = useState(0);
  const [hideAddition, setHideAddition] = useState(true);

  useEffect(() => {
    if (layout > 0 && layout <= 2) {
      setRow(0);
      if (sectionNum === 0) { setSectionNum(1); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

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

      // setLayout(refsHistory[0].length);
      // setSectionNum(1);

      // setLoadResource3(true);

      // setOpenResource3(false);

      // setReferenceColumnTwoData1({
      // languageId: 'en',
      // selectedResource: 'twlm',
      // refName: '',
      // header: '',
      // });

      // setReferenceColumnTwoData2({
      // languageId: 'en',
      // selectedResource: 'tq',
      // refName: '',
      // header: '',
      // });
    });
  }, []);

  useEffect(() => {
    if (sectionNum === 2) {
      setHideAddition(false);
    } else {
      setHideAddition(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionNum]);

  return (
    <>
      {((openResource1 === true && openResource2 === true)
      ? (layout >= 1 && layout <= 2) : (layout > 1 && layout <= 2)) && (
      <>
        {(openResource3 === false || openResource4 === false) && (
        <div className="m-3 ml-0 rounded-md overflow-hidden  pb-4">
          <>
            <EditorSection
              row="3"
              hideAddition={hideAddition}
              sectionNum={sectionNum}
              setSectionNum={setSectionNum}
              title={referenceColumnTwoData1.header === 'Notes' ? 'Translation Notes' : referenceColumnTwoData1.header}
              selectedResource={referenceColumnTwoData1.selectedResource}
              languageId={referenceColumnTwoData1.languageId}
              setReferenceResources={setReferenceColumnTwoData1}
              setLoadResource={setLoadResource3}
              loadResource={loadResource3}
              openResource={openResource3}
              setOpenResource3={setOpenResource3}
              setOpenResource4={setOpenResource4}
            >
              {
              (loadResource3 === true) && (
              referenceColumnTwoData1.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnTwoData1.languageId}
                  refName={referenceColumnTwoData1.refName}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnTwoData1.selectedResource}
                  languageId={referenceColumnTwoData1.languageId}
                />
              ))
            }
            </EditorSection>
          </>
          <>
            <EditorSection
              row="4"
              hideAddition={hideAddition}
              sectionNum={sectionNum}
              setSectionNum={setSectionNum}
              title={referenceColumnTwoData2.header === 'Notes' ? 'Translation Notes' : referenceColumnTwoData2.header}
              selectedResource={referenceColumnTwoData2.selectedResource}
              languageId={referenceColumnTwoData2.languageId}
              setReferenceResources={setReferenceColumnTwoData2}
              setLoadResource={setLoadResource4}
              loadResource={loadResource4}
              openResource={openResource4}
              setOpenResource3={setOpenResource3}
              setOpenResource4={setOpenResource4}
            >
              {
              (loadResource4 === true) && (
              referenceColumnTwoData2.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnTwoData2.languageId}
                  refName={referenceColumnTwoData2.refName}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnTwoData2.selectedResource}
                  languageId={referenceColumnTwoData2.languageId}
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
export default SectionPlaceholder2;
