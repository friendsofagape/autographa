import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, PencilAltIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import * as logger from '../../../logger';
import { ProjectContext } from '../../context/ProjectContext';

export default function TargetLanguagePopover() {
  const [id, setId] = React.useState();
  const [lang, setLang] = React.useState();
  const [direction, setDirection] = React.useState();
  const [edit, setEdit] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lock, setLock] = useState();
  const {
    states: {
      language,
      languages,
    }, actions: {
      setLanguage,
    },
  } = React.useContext(ProjectContext);
<<<<<<< HEAD
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
=======

>>>>>>> 824ed4f5af1d475dd3406ede2f735bd5f66506a6
  const openLanguageNav = (nav) => {
    logger.debug('TargetLanguagePopover.js', 'In openLanguageNav');
    if (nav === 'edit') {
      logger.debug('TargetLanguagePopover.js', 'Selected a language which can be edited');
      setLock(language.locked);
      setEdit(true);
      setId(language.id);
      setLang(language.title);
      setDirection(language.scriptDirection ? language.scriptDirection : 'LTR');
    } else {
      logger.debug('TargetLanguagePopover.js', 'Selected the Pre-defined language which can\'t be edited');
      setLock();
      setEdit(false);
      setLang();
      setDirection('LTR');
    }
  };
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const addLanguage = () => {
    logger.debug('TargetLanguagePopover.js', 'Adding a new language');
    setLanguage({ id: languages.length + 1, title: lang, scriptDirection: direction });
    closeModal();
  };
  const editLanguage = () => {
    logger.debug('TargetLanguagePopover.js', 'Editing the language');
    setLanguage({ id, title: lang, scriptDirection: direction });
    closeModal();
  };

  return (
    <>
      <div className="flex gap-3">
        <button
          type="button"
          className="focus:outline-none bg-primary h-8 w-8 flex items-center justify-center rounded-full"
          onClick={() => { openLanguageNav('add'); openModal(); }}
        >
          <PlusIcon
            className="h-5 w-5 text-white"
            aria-hidden="true"
          />

        </button>
        <button
          type="button"
          className="focus:outline-none bg-primary h-8 w-8 flex items-center justify-center rounded-full"
          onClick={() => { openLanguageNav('edit'); openModal(); }}
        >
          <PencilAltIcon
            className="h-5 w-5 text-white"
            aria-hidden="true"
          />
        </button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>

        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >

            <div className="fixed inset-0 flex items-center justify-center">
              <div className="  h-80 rounded shadow border border-gray-200 bg-white">
                <div className="grid grid-rows-2 gap-5 m-8">
                  <div>
                    <h2 className="uppercase font-bold leading-5 tracking-widest mb-5 ">
                      {edit ? t('label-edit-langauge') : t('label-new-langauge')}
                    </h2>
                    <div>
                      <input
                        type="text"
                        name="search_box"
                        id="search_box"
                        autoComplete="given-name"
                        value={lang}
                        onChange={(e) => { setLang(e.target.value); }}
                        disabled={lock}
                        className="bg-gray-200 w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs font-base  text-primary tracking-wide leading-4 font-light">{t('label-script-direction')}</h3>
                    <div>
                      <div className=" mb-3">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-primary"
                          value="LTR"
                          checked={direction === 'LTR'}
                          onChange={() => setDirection('LTR')}
                          disabled={lock}
                        />
                        <span className=" ml-4 text-xs font-bold">{t('label-ltr')}</span>
                      </div>
                      <div>
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-primary"
                          value="RTL"
                          checked={direction === 'RTL'}
                          onChange={() => setDirection('RTL')}
                          disabled={lock}
                        />
                        <span className=" ml-3 text-xs font-bold">{t('label-rtl')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mr-5 bg-error w-28 h-8 border-color-error rounded
                                  uppercase shadow text-white text-xs tracking-wide leading-4 font-light focus:outline-none"
                    >
                      {t('btn-cancel')}
                    </button>
                    {lock ? <div />
                    : (
                      <button
                        type="button"
                        className=" bg-success w-28 h-8 border-color-success rounded uppercase text-white text-xs shadow focus:outline-none"
                        onClick={() => (edit === true ? editLanguage() : addLanguage())}
                      >
                        {edit ? t('btn-save') : t('btn-create')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
