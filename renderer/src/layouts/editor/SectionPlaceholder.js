import { ReferenceContext } from '@/components/context/ReferenceContext';
import EditorSection from '@/layouts/editor/EditorSection';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import ReferenceBible from '@/components/EditorPage/Reference/ReferenceBible/ReferenceBible';

const TranslationHelps = dynamic(
  () => import('@/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);

const SectionPlaceholder = () => {
  const [referenceColumnOneData, setReferenceCoulumnOneData] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
  });
  const [referenceColumnTwoData, setReferenceCoulumnTwoData] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
  });
  const [referenceColumnThreeData, setReferenceColumnThreeData] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
  });
  const [referenceColumnFourData, setReferenceColumnFourData] = useState({
    languageId: '',
    selectedResource: '',
    refName: '',
    header: '',
  });
  const [loadResource1, setLoadResource1] = useState(false);
  const [loadResource2, setLoadResource2] = useState(false);
  const [loadResource3, setLoadResource3] = useState(false);
  const [loadResource4, setLoadResource4] = useState(false);
  const {
    state: {
      layout,
      row,
      openResource1,
      openResource2,
      openResource3,
      openResource4,
    },
    actions: {
      setRow,
      setOpenResource1,
      setOpenResource2,
      setOpenResource3,
      setOpenResource4,
    },
  } = useContext(ReferenceContext);
  const [sectionNum, setSectionNum] = useState();

  useEffect(() => {
    if (layout === 0 && layout < 2) {
      setRow(0);
    }
    setSectionNum(layout);
  }, [layout]);

  return (
    <>

      {(layout > 0 && layout <= 4) && (
        <>
          <div className="m-3 rounded-md overflow-hidden  pb-4">
            {(sectionNum > 0 && sectionNum <= 4) && (
              <>
                <EditorSection
                  column="1"
                  sectionNum={sectionNum}
                  setSectionNum={setSectionNum}
                  title={referenceColumnOneData.header === 'Notes' ? 'Translation Notes' : referenceColumnOneData.header}
                  selectedResource={referenceColumnOneData.selectedResource}
                  setReferenceResources={setReferenceCoulumnOneData}
                  languageId={referenceColumnOneData.languageId}
                  setLoadResource={setLoadResource1}
                  loadResource={loadResource1}
                  openResource={openResource1}
                  setOpenResource1={setOpenResource1}
                >
                  {
            (loadResource1 === true) && (
              referenceColumnOneData.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnOneData.languageId}
                  refName={referenceColumnOneData.refName}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnOneData.selectedResource}
                  languageId={referenceColumnOneData.languageId}
                // refName={referenceColumnOneData.refName}
                />
              )
            )
          }
                </EditorSection>
              </>
          )}
            {(sectionNum > 2 && sectionNum <= 4) && (
              <>
                <EditorSection
                  column="3"
                  sectionNum={sectionNum}
                  setSectionNum={setSectionNum}
                  title={referenceColumnThreeData.header === 'Notes' ? 'Translation Notes' : referenceColumnThreeData.header}
                  selectedResource={referenceColumnThreeData.selectedResource}
                  languageId={referenceColumnThreeData.languageId}
                  setReferenceResources={setReferenceColumnThreeData}
                  setLoadResource={setLoadResource3}
                  loadResource={loadResource3}
                  openResource={openResource3}
                  setOpenResource3={setOpenResource3}
                >
                  {
                (loadResource3 === true) && (
                referenceColumnThreeData.selectedResource === 'bible' ? (
                  <ReferenceBible
                    languageId={referenceColumnThreeData.languageId}
                    refName={referenceColumnThreeData.refName}
                  />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnThreeData.selectedResource}
                  languageId={referenceColumnThreeData.languageId}
                />
              ))
            }
                </EditorSection>
              </>
            )}
          </div>
        </>
      )}
      {(layout > 1 && layout <= 4) && (
      <>
        <div className="m-3 ml-0 rounded-md overflow-hidden  pb-4">
          {(sectionNum > 1 && sectionNum <= 4) && (
            <>
              <EditorSection
                column="2"
                sectionNum={sectionNum}
                setSectionNum={setSectionNum}
                title={referenceColumnTwoData.header === 'Notes' ? 'Translation Notes' : referenceColumnTwoData.header}
                selectedResource={referenceColumnTwoData.selectedResource}
                languageId={referenceColumnTwoData.languageId}
                setReferenceResources={setReferenceCoulumnTwoData}
                setLoadResource={setLoadResource2}
                loadResource={loadResource2}
                openResource={openResource2}
                setOpenResource2={setOpenResource2}
              >
                {
              (loadResource2 === true) && (
              referenceColumnTwoData.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnTwoData.languageId}
                  refName={referenceColumnTwoData.refName}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnTwoData.selectedResource}
                  languageId={referenceColumnTwoData.languageId}
                />
              ))
            }
              </EditorSection>
            </>
        )}
          {(sectionNum > 3 && sectionNum <= 4) && (
            <>
              <EditorSection
                column="4"
                sectionNum={sectionNum}
                setSectionNum={setSectionNum}
                title={referenceColumnFourData.header === 'Notes' ? 'Translation Notes' : referenceColumnFourData.header}
                selectedResource={referenceColumnFourData.selectedResource}
                languageId={referenceColumnFourData.languageId}
                setReferenceResources={setReferenceColumnFourData}
                setLoadResource={setLoadResource4}
                loadResource={loadResource4}
                openResource={openResource4}
                setOpenResource4={setOpenResource4}
              >
                {
              (loadResource4 === true) && (
              referenceColumnFourData.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnFourData.languageId}
                  refName={referenceColumnFourData.refName}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnFourData.selectedResource}
                  languageId={referenceColumnFourData.languageId}
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
export default SectionPlaceholder;
