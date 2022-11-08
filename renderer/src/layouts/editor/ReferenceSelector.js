import React, { useContext } from 'react';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import ColumnLayout from './ColumnLayout';

export default function ReferenceSelector() {
  const {
    state: {
      layout,
    },
  } = useContext(ReferenceContext);

  return (
    <div className="grid grid-flow-col auto-cols-fr m-3 h-editor gap-2">
      <ColumnLayout colNumber={layout} />
    </div>
  );
}
