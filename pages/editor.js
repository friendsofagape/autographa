import ReferenceContextProvider from '@/components/context/ReferenceContext';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';

import EditorLayout from '@/layouts/editor/Layout';

export default function ReferenceSelector() {
  return (
    <AuthenticationContextProvider>
      <ReferenceContextProvider>
        <EditorLayout />
      </ReferenceContextProvider>
    </AuthenticationContextProvider>
  );
}
