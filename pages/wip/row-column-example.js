import React, { useState } from 'react';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import CustomNavigationContextProvider from '@/components/context/CustomNavigationContext';
import EditorLayout from '@/layouts/editor/Layout';
import AutographaContextProvider
  from '@/components/context/AutographaContext';
import ColumnLayout from './ColumnLayout';

export default function ReferenceSelector() {
  const [colNumber, setColNumber] = useState(1);

  function addColumn() {
    const col = colNumber < 3 ? colNumber + 1 : 1;
    // console.log(col);
    setColNumber(col);
  }

  return (

    <AuthenticationContextProvider>
      <AutographaContextProvider>
        <ProjectContextProvider>
          <ReferenceContextProvider>
            <CustomNavigationContextProvider>
              <EditorLayout>
                <button
                  onClick={addColumn}
                  type="button"
                  className="inline-flex shadow mx-4 my-4 items-center justify-center px-3 py-2 border
                              border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-dark"
                >
                  Add Columns
                  {colNumber}
                </button>

                <div className="grid grid-flow-col auto-cols-fr m-3 gap-2">
                  <ColumnLayout colNumber={colNumber} />
                </div>

              </EditorLayout>
            </CustomNavigationContextProvider>
          </ReferenceContextProvider>
        </ProjectContextProvider>
      </AutographaContextProvider>
    </AuthenticationContextProvider>
  );
}
