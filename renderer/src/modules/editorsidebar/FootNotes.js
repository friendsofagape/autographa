import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ChevronDownIcon, PencilAltIcon,
} from '@heroicons/react/solid';

import EditFootnote from './EditFootnote';

const footnotes = [
  {
    id: 1,
    title: 'Genesis 1:1 In the beginning',
    list: [
      {
        id: 1,
        footnote: '“Where were you when I laid the foundation of the earth? Tell me, if you have understanding. Who determined its measurements—surely you know! Or who stretched the line upon it? On what were its bases sunk, or who laid its cornerstone, when the morning stars sang together and all the sons of God shouted for joy?',
      },
    ],
  },
  {
    id: 2,
    title: 'Genesis 1:1 In the beginning',
    list: [
      {
        id: 1,
        footnote: '“Where were you when I laid the foundation of the earth? Tell me, if you have understanding. Who determined its measurements—surely you know! Or who stretched the line upon it? On what were its bases sunk, or who laid its cornerstone, when the morning stars sang together and all the sons of God shouted for joy?',
      },
    ],
  },
  {
    id: 3,
    title: 'Genesis 1:1 In the beginning',
    list: [
      {
        id: 1,
        footnote: '“Where were you when I laid the foundation of the earth? Tell me, if you have understanding. Who determined its measurements—surely you know! Or who stretched the line upon it? On what were its bases sunk, or who laid its cornerstone, when the morning stars sang together and all the sons of God shouted for joy?',
      },
    ],
  },
];

export default function FootNotes() {
  const [isEditFootNoteOpen, setEditFootNote] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="bg-gray-800 uppercase text-white text-xs p-2 tracking-wider">
        {t('label-footnotes')}
      </div>
      <div className="overflow-y-auto h-full no-scrollbars">

        {footnotes.map((section) => (
          <>
            <div className="flex justify-between items-center bg-gray-200 p-2 pr-2 text-sm font-semibold tracking-wider">
              <div className="flex items-center">
                <span className="inline-flex items-center pr-2 text-gray-400 text-sm">
                  <ChevronDownIcon className="w-5 h-5" />
                </span>
                <span>{section.title}</span>
              </div>
              <div className="flex justify-end items-center">
                {!isEditFootNoteOpen
                  && (
                    <button
                      type="button"
                      className="ml-2 p-1 rounded bg-primary text-white"
                      onClick={() => setEditFootNote(true)}
                    >
                      <PencilAltIcon className="w-3 h-3" />
                    </button>
                  )}
              </div>
            </div>
            <div className="mt-3 tracking-wider text-xs">
              {section.list.map((list) => (
                <p className="leading-5 mx-5 py-1 pb-4">{list.footnote}</p>
              ))}
              {isEditFootNoteOpen && <EditFootnote />}
            </div>
          </>
        ))}

      </div>
    </>
  );
}
