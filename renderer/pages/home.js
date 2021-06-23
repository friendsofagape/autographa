import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import EditorLayout from '@/layouts/editor/Layout';
import Editor from '@/modules/editor/Editor';
import dynamic from 'next/dynamic';

const TranslationHelps = dynamic(
  () => import('@/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);
const UsfmEditor = dynamic(
  () => import('@/components/EditorPage/UsfmEditor/UsfmEditor'),
  { ssr: false },
);
export default function ReferenceSelector() {
  return (
    <AuthenticationContextProvider>
      <ProjectContextProvider>
        <ReferenceContextProvider>
          <EditorLayout>
            <div className="grid grid-cols-3 h-editor">
              <div className="m-3 ml-0 rounded-md shadow overflow-y-auto"><TranslationHelps /></div>
              <div className="m-3 ml-0 px-3 py-2 rounded-md shadow" />
              <div className="m-3 ml-0 border-b-2 border-secondary rounded-md shadow overflow-hidden">
                <UsfmEditor />
              </div>
            </div>
          </EditorLayout>
        </ReferenceContextProvider>
      </ProjectContextProvider>
    </AuthenticationContextProvider>
  );
}
