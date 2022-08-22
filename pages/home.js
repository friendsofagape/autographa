import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import EditorLayout from '@/layouts/editor/Layout';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import dynamic from 'next/dynamic';
import CustomNavigationContextProvider from '@/components/context/CustomNavigationContext';
import SectionPlaceholder from '@/layouts/editor/SectionPlaceholder1';

import AutographaContextProvider from '@/components/context/AutographaContext';
import ScribexContextProvider from '@/components/context/ScribexContext';

const Scribex = dynamic(
  () => import('@/components/EditorPage/Scribex/Scribex'),
  { ssr: false },
);

const home = () => (
  <>
    <AuthenticationContextProvider>
      <AutographaContextProvider>
        <ProjectContextProvider>
          <ReferenceContextProvider>
            <ScribexContextProvider>
              <CustomNavigationContextProvider>
                <EditorLayout>
                  <div className="grid grid-flow-col auto-cols-fr m-3 h-editor gap-2">
                    <SectionPlaceholder />
                    <div className="bg-white m-3 ml-0 border-b-2 border-secondary rounded-md shadow overflow-hidden">
                      <Scribex />
                    </div>
                  </div>
                </EditorLayout>
              </CustomNavigationContextProvider>
            </ScribexContextProvider>
          </ReferenceContextProvider>
        </ProjectContextProvider>
      </AutographaContextProvider>
    </AuthenticationContextProvider>

    {/* <DynamicComponentWithNoSSR /> */}
  </>
);

export default home;
