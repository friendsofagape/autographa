import React, { useContext, useState } from 'react';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import CustomNavigationContextProvider from '@/components/context/CustomNavigationContext';
import AutographaContextProvider
  from '@/components/context/AutographaContext';
import ColumnLayout from './ColumnLayout';

export default function ReferenceSelector() {
  const [colNumber, setColNumber] = useState(1);
  const {
    state: {
      layout,
    },
  } = useContext(ReferenceContext);

  function addColumn() {
    const col = colNumber < 3 ? colNumber + 1 : 1;
    // console.log(col);
    setColNumber(col);
  }

  return (
    <div className="grid grid-flow-col auto-cols-fr m-3 h-editor gap-2">
      <ColumnLayout colNumber={layout} />
    </div>
  );
}
