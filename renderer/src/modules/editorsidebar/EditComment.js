import {
  XIcon,
} from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';

export default function Comments() {
  const { t } = useTranslation();
  return (
    <>
      <div className="bg-primary h-8 w-full text-white font-semibold flex items-center">
        <div className="flex-1 px-4 text-xs uppercase">{t('label-add-comment')}</div>
        <div className="flex justify-end">
          <button type="button" className="w-8 h-8 bg-black bg-opacity-20 p-2 focus:outline-none">
            <XIcon />
          </button>
        </div>
      </div>

      <div className="bg-black p-4">
        <textarea className="bg-white h-28 w-full border-0 mb-2 p-2 pb-5 text-sm rounded" />
        <div className="flex justify-between ">
          <div className="flex items-center">
            <img
              className="inline-block h-8 w-8 mr-2 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <h5 className="font-semibold text-white text-sm ml-2">Arpit Jacob</h5>
          </div>
          <button
            type="button"
            className="w-20 h-8 bg-success leading-loose rounded shadow text-xs font-base  text-white tracking-wide  font-light uppercase"
          >
            {t('btn-save')}
          </button>
        </div>
      </div>
    </>
  );
}
