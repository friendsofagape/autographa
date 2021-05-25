import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';

import EditorLayout from '@/layouts/editor/Layout';

export default function ReferenceSelector() {
  return (
    <AuthenticationContextProvider>
      <EditorLayout />
    </AuthenticationContextProvider>
  );
}
