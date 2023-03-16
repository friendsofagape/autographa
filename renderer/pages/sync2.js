import Sync2 from '@/modules/projects/Sync2';
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import AutographaContextProvider from '@/components/context/AutographaContext';
import SyncContextProvider from '@/components/Sync2/SyncContextProvider';

const projects = () => (
  <AuthenticationContextProvider>
    <AutographaContextProvider>
      <SyncContextProvider>
        <Sync2 />
      </SyncContextProvider>
    </AutographaContextProvider>
  </AuthenticationContextProvider>
);

export default projects;
