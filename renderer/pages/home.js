import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import EditorLayout from '@/layouts/editor/Layout';
// import Editor from '@/modules/editor/Editor';
import dynamic from 'next/dynamic';
import SectionPlaceholder from '@/layouts/editor/SectionPlaceholder';

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
              <SectionPlaceholder />
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
