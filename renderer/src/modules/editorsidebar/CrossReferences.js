import { useState } from 'react';

import {
  ChevronDownIcon, PlusIcon,
} from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import EditCrossReference from './EditCrossReference';

const references = [
  {
    id: 1,
    title: 'Genesis 1:1 In the beginning',
    list: [
      {
        id: 1,
        ref: 'Job 38:4-7',
        refText: '“Where were you when I laid the foundation of the earth? Tell me, if you have understanding. Who determined its measurements—surely you know! Or who stretched the line upon it? On what were its bases sunk, or who laid its cornerstone, when the morning stars sang together and all the sons of God shouted for joy?',
      },
      {
        id: 2,
        ref: 'Psalms 33:6',
        refText: '“Where were you when I laid the foundation of the earth? Tell me, if you have understanding. Who determined its measurements—surely you know! Or who stretched the line upon it? On what were its bases sunk, or who laid its cornerstone, when the morning stars sang together and all the sons of God shouted for joy?',
      },
    ],
  },
  {
    id: 2,
    title: 'James 1:1',
    list: [
      {
        id: 1,
        ref: 'Job 38:4-7',
        refText: '“Where were you when I laid the foundation of the earth? Tell me, if you have understanding. Who determined its measurements—surely you know! Or who stretched the line upon it? On what were its bases sunk, or who laid its cornerstone, when the morning stars sang together and all the sons of God shouted for joy?',
      },
      {
        id: 2,
        ref: 'Psalms 33:6',
        refText: '“Where were you when I laid the foundation of the earth? Tell me, if you have understanding. Who determined its measurements—surely you know! Or who stretched the line upon it? On what were its bases sunk, or who laid its cornerstone, when the morning stars sang together and all the sons of God shouted for joy?',
      },
    ],
  },
  {
    id: 3,
    title: 'Peter 1:1',
    list: [
      {
        id: 1,
        ref: 'Job 38:4-7',
        refText: '“Where were you when I laid the foundation of the earth? Tell me, if you have understanding. Who determined its measurements—surely you know! Or who stretched the line upon it? On what were its bases sunk, or who laid its cornerstone, when the morning stars sang together and all the sons of God shouted for joy?',
      },
      {
        id: 2,
        ref: 'Psalms 33:6',
        refText: '“Where were you when I laid the foundation of the earth? Tell me, if you have understanding. Who determined its measurements—surely you know! Or who stretched the line upon it? On what were its bases sunk, or who laid its cornerstone, when the morning stars sang together and all the sons of God shouted for joy?',
      },
      {
        id: 3,
        ref: 'Psalms 33:6',
        refText: '“Where were you when I laid the foundation of the earth? Tell me, if you have understanding. Who determined its measurements—surely you know! Or who stretched the line upon it? On what were its bases sunk, or who laid its cornerstone, when the morning stars sang together and all the sons of God shouted for joy?',
      },
    ],
  },
];

export default function CrossReference() {
  const [isEditCrossReferenceOpen, setEditCrossReference] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="bg-gray-800 uppercase text-white text-xs p-2 tracking-wider">
        {t('label-cross-ref')}
      </div>
      <div className="overflow-y-auto h-full no-scrollbars">

        {references.map((section) => (
          <>
            <div className="flex justify-between items-center bg-gray-200 p-2 pr-2 text-sm font-semibold tracking-wider">
              <div className="flex items-center">
                <span className="inline-flex items-center pr-2 text-gray-400 text-sm">
                  <ChevronDownIcon className="w-5 h-5" />
                </span>
                <span>{section.title}</span>
              </div>
              <div className="flex justify-end items-center">
                <span className="inline-block px-2 bg-gray-400 rounded-full text-xxs">{section.list.length}</span>
                {!isEditCrossReferenceOpen
                  && (
                    <button
                      type="button"
                      className="ml-2 p-1 rounded bg-primary text-white"
                      onClick={() => setEditCrossReference(true)}
                    >
                      <PlusIcon className="w-3 h-3" />
                    </button>
                  )}
              </div>
            </div>

            <div className="mt-3 tracking-wider text-xs relative">
              {section.list.map((list) => (
                <>
                  <h5 className="h-6 mx-4 font-semibold flex justify-between items-center content-center group">
                    <div>{list.ref}</div>
                    <div className="flex justify-end">

                      <button type="button" className="bg-gray-200 p-1 rounded-sm hidden group-hover:block">
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </h5>
                  <p className="mx-4 leading-5 py-1 pb-4">{list.refText}</p>
                </>
              ))}

              {isEditCrossReferenceOpen && <EditCrossReference />}

            </div>
          </>

        ))}
      </div>
    </>
  );
}
