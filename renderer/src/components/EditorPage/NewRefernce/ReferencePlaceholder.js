import { ReferenceContext } from '@/components/context/ReferenceContext';
import EditorSectionSmall from '@/modules/projects/SmallEditorSection';
import dynamic from 'next/dynamic';
import { useContext, useState } from 'react';
import RefBible from '../Reference/RefBible/RefBible';

const TranslationHelps = dynamic(
    () => import('@/components/EditorPage/Reference/TranslationHelps'),
    { ssr: false },
);
const ReferencePlaceholder = () => {
    const [referenceColumnOneData, setReferenceCoulumnOneData] = useState({
      languageId: 'en',
      selectedResource: 'tn',
      refName: '',
      header: '',
    });
    const [referenceColumnTwoData, setReferenceCoulumnTwoData] = useState({
      languageId: 'en',
      selectedResource: 'tn',
      refName: '',
      header: '',
    });
    // const [languageId, setLanguageId] = useState('en');
    // const [selectedResource, setSelectedResource] = useState('tn');
    // const [header, setHeader] = useState('');
    // const [refName, setRefName] = useState('');
    const {
        state: {
            layout,
        },
      } = useContext(ReferenceContext);
      console.log(referenceColumnOneData.selectedResource, referenceColumnOneData.languageId,
        referenceColumnTwoData.selectedResource, referenceColumnTwoData.languageId);
return (
  <>

    {layout === 1 && (
    <>
      <div className="m-3 ml-0 border-b-2 rounded-md shadow overflow-y-auto">
        <EditorSectionSmall
          title={referenceColumnOneData.header === 'Notes' ? 'Translation Notes' : referenceColumnOneData.header}
          selectedResource={referenceColumnOneData.selectedResource}
          setReferenceResources={setReferenceCoulumnOneData}
        >
          {referenceColumnOneData.selectedResource === 'bible' ? (
            <RefBible
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
        >
          {referenceColumnOneData.selectedResource === 'bible' ? (
            <RefBible
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
          setReferenceResources={setReferenceCoulumnTwoData}
        >
          {referenceColumnTwoData.selectedResource === 'bible' ? (
            <RefBible
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

    {layout >= 3 && (
    <>
      <div className="m-3 ml-0 border-b-2 rounded-md shadow overflow-y-auto" />
      <div className="m-3 ml-0 border-b-2 rounded-md shadow overflow-y-auto" />
    </>
    )}
  </>
);
};
export default ReferencePlaceholder;
