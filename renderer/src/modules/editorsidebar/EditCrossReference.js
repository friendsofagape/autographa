import { TrashIcon } from '@heroicons/react/outline';

import {
  XIcon,
} from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';
import BibleNavigation from '@/modules/biblenavigation/BibleNavigation';

export default function Comments() {
  const { t } = useTranslation();
  return (
    <>
      <div className="bg-primary h-8 w-full text-white font-semibold flex items-center">
        <BibleNavigation />
        <div className="flex-1 px-4 text-xs uppercase">{t('label-add-ref')}</div>
        <div className="flex justify-end">
          <button type="button" className="bg-black bg-opacity-20 p-2 rounded-sm">
            <TrashIcon className="w-4 h-4" />
          </button>
          <button type="button" className="w-8 h-8 bg-black bg-opacity-20 p-2 focus:outline-none">
            <XIcon />
          </button>
        </div>
      </div>

      <div className="bg-black p-4">
        <div className="bg-black text-white w-full border-0 mb-1 p-2 text-sm rounded">
          “Where were you when I laid the foundation of the earth? Tell me, if you have
          understanding. Who determined its measurements—surely you know! Or who stretched the
          line upon it? On what were its bases sunk, or who laid its cornerstone, when the
          morning stars sang together and all the sons of God shouted for joy?
        </div>
        <div className="flex justify-end">
          {/* <div className="flex items-center">
            <img
              className="inline-block h-8 w-8 mr-2 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <h5 className="font-semibold text-white text-sm ml-2">Arpit Jacob</h5>
          </div> */}
          <button
            type="button"
            className="w-20 h-8 bg-success leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
          >
            {t('btn-add')}
          </button>
        </div>
      </div>
    </>
  );
}
