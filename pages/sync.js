import Sync from '@/modules/projects/Sync';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import SyncContextProvider from '@/components/Sync/SyncContextProvider';

const projects = () => (
  <AuthenticationContextProvider>
    <SyncContextProvider>
      <Sync />
    </SyncContextProvider>
  </AuthenticationContextProvider>
);

export default projects;
