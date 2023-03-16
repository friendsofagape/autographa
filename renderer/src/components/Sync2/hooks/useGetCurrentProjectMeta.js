import fetchProjectsMeta from '@/core/projects/fetchProjectsMeta';
import localforage from 'localforage';
import { useState } from 'react';

export default function useGetCurrentProjectMeta() {
    let meta;
    const [currentProjectMeta, setCurrentProjectMeta] = useState(undefined);

    const getProjectMeta = async (currentProjectName) => {
        await localforage.getItem('userProfile').then(async (user) => {
          await fetchProjectsMeta({ currentUser: user?.username })
          .then(async (value) => {
            const projectName = (currentProjectName.slice(0, currentProjectName.lastIndexOf('_'))).toLowerCase();
            meta = value.projects.filter((val) => val.identification.name.en.toLowerCase() === projectName.toLowerCase());
            // console.log({ projectName, meta });
          }).finally(() => {
            if (meta && meta?.length > 0) {
              setCurrentProjectMeta(meta[0]);
            }
        });
        });
      };

      const response = {
        state: {
          currentProjectMeta,
        },
        actions: {
          getProjectMeta,
        },
      };
      return response;
}
