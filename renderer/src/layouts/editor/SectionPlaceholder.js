import { ReferenceContext } from '@/components/context/ReferenceContext';
import EditorSection from '@/layouts/editor/EditorSection';
import dynamic from 'next/dynamic';
import { useContext, useState } from 'react';
import ReferenceBible from '@/components/EditorPage/Reference/ReferenceBible/ReferenceBible';

const TranslationHelps = dynamic(
  () => import('@/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);

const SectionPlaceholder = () => {
  const [referenceColumnOneData, setReferenceCoulumnOneData] = useState({
    languageId: 'en',
    selectedResource: 'tq',
    refName: '',
    header: '',
  });
  const [referenceColumnTwoData, setReferenceCoulumnTwoData] = useState({
    languageId: 'en',
    selectedResource: 'tn',
    refName: '',
    header: '',
  });
  const {
    state: {
      layout,
    },
  } = useContext(ReferenceContext);
  return (
    <>
      {layout === 1 && (
        <>
          <div className="m-3 rounded-md overflow-hidden  pb-4">
            <EditorSection
              title={referenceColumnOneData.header === 'Notes' ? 'Translation Notes' : referenceColumnOneData.header}
              selectedResource={referenceColumnOneData.selectedResource}
              setReferenceResources={setReferenceCoulumnOneData}
              languageId={referenceColumnOneData.languageId}
            >
              {referenceColumnOneData.selectedResource === 'bible' ? (
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
              )}
            </EditorSection>
          </div>
          <div className="m-3 ml-0 rounded-md overflow-hidden  pb-4" />
        </>
      )}

      {layout === 2 && (
        <>
          <div className="m-3 rounded-md overflow-hidden  pb-4">
            <EditorSection
              column="1"
              title={referenceColumnOneData.header === 'Notes' ? 'Translation Notes' : referenceColumnOneData.header}
              selectedResource={referenceColumnOneData.selectedResource}
              setReferenceResources={setReferenceCoulumnOneData}
              languageId={referenceColumnOneData.languageId}
            />
          </div>

          <div className="m-3 ml-0 rounded-md overflow-hidden  pb-4">
            <EditorSection
              column="2"
              // title="Translation Notes Long Title"
              title={referenceColumnTwoData.header === 'Notes' ? 'Translation Notes' : referenceColumnTwoData.header}
              selectedResource={referenceColumnTwoData.selectedResource}
              languageId={referenceColumnTwoData.languageId}
              setReferenceResources={setReferenceCoulumnTwoData}
            >
              {referenceColumnTwoData.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnTwoData.languageId}
                  refName={referenceColumnTwoData.refName}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnTwoData.selectedResource}
                  languageId={referenceColumnTwoData.languageId}
                />
              )}
            </EditorSection>
            <EditorSection
              column="2"
              title={referenceColumnTwoData.header === 'Notes' ? 'Translation Notes' : referenceColumnTwoData.header}
              selectedResource={referenceColumnTwoData.selectedResource}
              languageId={referenceColumnTwoData.languageId}
              setReferenceResources={setReferenceCoulumnTwoData}
            >
              {referenceColumnTwoData.selectedResource === 'bible' ? (
                <ReferenceBible
                  languageId={referenceColumnTwoData.languageId}
                  refName={referenceColumnTwoData.refName}
                />
              ) : (
                <TranslationHelps
                  selectedResource={referenceColumnTwoData.selectedResource}
                  languageId={referenceColumnTwoData.languageId}
                />
              )}
            </EditorSection>
          </div>

        </>
      )}
      {(layout >= 3 || layout === 0) && (
        <>
          <div className="m-3 rounded-md overflow-hidden  pb-4" />
          <div className="m-3 ml-0 rounded-md overflow-hidden  pb-4" />
        </>
      )}
    </>
  );
};
export default SectionPlaceholder;
