import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import CustomNavigationContextProvider from '@/components/context/CustomNavigationContext';
import EditorLayout from '@/layouts/editor/Layout';
// import Editor from '@/modules/editor/Editor';
import dynamic from 'next/dynamic';
import ReferencePlaceholder from '@/components/EditorPage/NewRefernce/ReferencePlaceholder';

const TranslationHelps = dynamic(
  () => import('@/components/EditorPage/Reference/TranslationHelps'),
  { ssr: false },
);
const UsfmEditor = dynamic(
  () => import('@/components/EditorPage/UsfmEditor/UsfmEditor'),
  { ssr: false },
);
const ReferenceCard = dynamic(
  () => import('@/components/EditorPage/Reference/ReferenceCard'),
  { ssr: false },
);
export default function ReferenceSelector() {
  return (
    <AuthenticationContextProvider>
      <ProjectContextProvider>
        <ReferenceContextProvider>
          <CustomNavigationContextProvider>
            <EditorLayout>
              <div className="grid grid-cols-3 h-editor">
                <ReferencePlaceholder />
                <div className="m-3 ml-0 border-b-2 border-secondary rounded-md shadow overflow-hidden">
                  <UsfmEditor />
                </div>
              </div>
            </EditorLayout>
          </CustomNavigationContextProvider>
        </ReferenceContextProvider>
      </ProjectContextProvider>
    </AuthenticationContextProvider>
  );
}
