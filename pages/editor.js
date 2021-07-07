import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import CustomNavigationContextProvider from '@/components/context/CustomNavigationContext';
import EditorLayout from '@/layouts/editor/Layout';
import Editor from '@/modules/editor/Editor';

export default function ReferenceSelector() {
  return (
    <AuthenticationContextProvider>
      <ProjectContextProvider>
        <ReferenceContextProvider>
          <CustomNavigationContextProvider>
            <EditorLayout>
              <div className="grid grid-cols-3 h-editor">
                <div className="m-3 px-3 py-2 rounded-md shadow">column 1</div>
                <div className="m-3 ml-0 px-3 py-2 rounded-md shadow">column 2</div>
                <div className="m-3 ml-0 border-b-2 border-secondary rounded-md shadow overflow-hidden">
                  <Editor />
                </div>
              </div>
            </EditorLayout>
          </CustomNavigationContextProvider>
        </ReferenceContextProvider>
      </ProjectContextProvider>
    </AuthenticationContextProvider>
  );
}
