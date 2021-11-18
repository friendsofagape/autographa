import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import EditorLayout from '@/layouts/editor/Layout';
// import Editor from '@/modules/editor/Editor';
import SectionContainer from '@/layouts/editor/SectionContainer';
import AutographaContextProvider from '@/components/context/AutographaContext';

export default function ReferenceSelector() {
  return (
    <AuthenticationContextProvider>
      <ProjectContextProvider>
        <ReferenceContextProvider>
          <AutographaContextProvider>
            <EditorLayout>
              <div className="grid grid-flow-col auto-cols-fr m-3 h-editor gap-2">
                <SectionContainer />
              </div>
            </EditorLayout>
          </AutographaContextProvider>
        </ReferenceContextProvider>
      </ProjectContextProvider>
    </AuthenticationContextProvider>
  );
}
