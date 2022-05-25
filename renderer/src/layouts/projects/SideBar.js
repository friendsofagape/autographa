import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as localForage from 'localforage';
import { useTranslation } from 'react-i18next';
import LogoIcon from '@/icons/logo.svg';
import ProjectsIcon from '@/icons/projects.svg';
import NewProjectIcon from '@/icons/new.svg';
import SyncIcon from '@/icons/sync.svg';

export default function SideBar() {
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
          <Link href="/projects">
            <a aria-label="projectList" className="flex flex-col items-center" href="#projects">
              <ProjectsIcon
                fill="none"
                strokecurrent="none"
                className="h-7 w-7 text-dark group-hover:text-white"
              />
              <div className="text-xs mt-3 uppercase">{t('projects-page')}</div>
            </a>
          </Link>
        </li>
        <li className="text-gray-900 font-medium hover:text-white hover:bg-primary cursor-pointer py-5 group">
          <Link href="/newproject">
            <a aria-label="new" className="flex flex-col items-center" href="#new">
              <NewProjectIcon
                fill="none"
                strokecurrent="none"
                className="h-7 w-7 text-dark group-hover:text-white"
              />
              <div className="text-xs mt-3 uppercase">{t('btn-new')}</div>
            </a>
          </Link>
        </li>
        {(appMode === 'online')
          && (
          <li className="text-gray-900 font-medium hover:text-white hover:bg-primary cursor-pointer py-5">
            <Link href="/sync">
              <a className="flex flex-col items-center" href="#sync">
                <SyncIcon
                  fill="none"
                  strokecurrent="none"
                  className="h-7 w-7 text-dark group-hover:text-white"
                />
                <div className="text-xs mt-3 uppercase">sync</div>
              </a>
            </Link>
          </li>
          )}
      </ul>
    </div>

  );
}
