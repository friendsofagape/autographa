import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as localForage from 'localforage';
import { useTranslation } from 'react-i18next';
import LogoIcon from '@/icons/logo.svg';
import ProjectsIcon from '@/icons/projects.svg';
import NewProjectIcon from '@/icons/new.svg';
import SyncIcon from '@/icons/sync.svg';

export default function SideBar() {
  // eslint-disable-next-line no-unused-vars
  const [appMode, setAppMode] = useState();
  const { t } = useTranslation();
  useEffect(() => {
    localForage.getItem('appMode')
      .then((value) => {
        setAppMode(value);
      });
  }, []);
  return (
    <div className="w-28 bg-white shadow min-h-screen">
      <div className="grid justify-items-center items-center h-16 border border-b-1">
        <LogoIcon
          className="h-8 w-8"
          alt="Workflow"
        />
      </div>
      <ul>
        <li className="text-gray-900 font-medium hover:text-white hover:bg-primary cursor-pointer py-5 group">
          <Link
            href="/projects"
            aria-label="projectList"
            className="flex flex-col items-center"
          >

            <ProjectsIcon
              fill="none"
              strokecurrent="none"
              className="h-7 w-7 text-dark group-hover:text-white"
            />
            <div className="text-xs mt-3 uppercase">{t('projects-page')}</div>

          </Link>
        </li>
        <li className="text-gray-900 font-medium hover:text-white hover:bg-primary cursor-pointer py-5 group">
          <Link
            href="/newproject"
            aria-label="new"
            className="flex flex-col items-center"
          >

            <NewProjectIcon
              fill="none"
              strokecurrent="none"
              className="h-7 w-7 text-dark group-hover:text-white"
            />
            <div className="text-xs mt-3 uppercase">{t('btn-new')}</div>

          </Link>
        </li>
        <li className="text-gray-900 font-medium hover:text-white hover:bg-primary cursor-pointer py-5">
          <Link href="/sync" className="flex flex-col items-center">

            <SyncIcon
              fill="none"
              strokecurrent="none"
              className="h-7 w-7 text-dark group-hover:text-white"
            />
            <div className="text-xs mt-3 uppercase">{t('label-sync')}</div>

          </Link>
        </li>
        {/* {(appMode === 'online')
          && (
          <li className="text-gray-900 font-medium hover:text-white hover:bg-primary cursor-pointer py-5">
            <Link href="/sync">
              <a className="flex flex-col items-center" href="#sync">
                <SyncIcon
                  fill="none"
                  strokecurrent="none"
                  className="h-7 w-7 text-dark group-hover:text-white"
                />
                <div className="text-xs mt-3 uppercase">{t('label-sync')}</div>
              </a>
            </Link>
          </li>
          )} */}
      </ul>
    </div>
  );
}
