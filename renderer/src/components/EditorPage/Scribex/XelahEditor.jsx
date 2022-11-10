import ScribexContextProvider from '@/components/context/ScribexContext';
import Scribex from './Scribex';

export default function XelahEditor() {
  return (
    <ScribexContextProvider>
      <Scribex />
    </ScribexContextProvider>
  );
}
