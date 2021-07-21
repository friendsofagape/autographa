import { ReferenceContext } from '@/components/context/ReferenceContext';
import EditorSectionSmall from '@/modules/projects/SmallEditorSection';
import dynamic from 'next/dynamic';
import { useContext, useState } from 'react';
import ReferenceBible from './ReferenceBible/ReferenceBible';

const TranslationHelps = dynamic(
  () => import('@/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);
const ReferencePlaceholder = () => {
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
          <div className="m-3 ml-0 border-b-2 rounded-md shadow overflow-y-auto ">
            <EditorSectionSmall
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
            </EditorSectionSmall>
          </div>
          <div className="m-3 ml-0 border-b-2 rounded-md shadow overflow-y-auto" />
        </>
      )}

      {layout === 2 && (
        <>
          <div className="m-3 ml-0 border-b-2 rounded-md shadow overflow-y-auto">
            <EditorSectionSmall
              column="1"
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
            </EditorSectionSmall>
          </div>

          <div className="m-3 rounded-md shadow overflow-y-auto">
            <EditorSectionSmall
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
            </EditorSectionSmall>
          </div>

        </>
      )}
      {(layout >= 3 || layout === 0) && (
        <>
          <div className="bg-white m-3 px-3 py-2 rounded-md shadow">column 1</div>
          <div className="bg-white m-3 ml-0 px-3 py-2 rounded-md shadow">column 2</div>
        </>
      )}
    </>
  );
};
export default ReferencePlaceholder;
