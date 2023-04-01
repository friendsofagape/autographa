import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { SnackBar } from '@/components/SnackBar';
import PropTypes from 'prop-types';
import useValidator from '@/components/hooks/useValidator';
import * as logger from '../../../logger';
import { ProjectContext } from '../../context/ProjectContext';

export default function TargetLanguagePopover({ projectType }) {
  const [id, setId] = React.useState();
  const [lang, setLang] = React.useState();
  const [direction, setDirection] = React.useState();
  const [langCode, setLangCode] = React.useState();
  const [edit, setEdit] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [snackBar, setOpenSnackBar] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [notify, setNotify] = React.useState();
  const [lock, setLock] = useState();
  const {
    states: {
      language,
      languages,
    }, actions: {
      setLanguage,
    },
  } = React.useContext(ProjectContext);
  const { t } = useTranslation();

  const [errors, setErrors] = React.useState({
    lang: '',
    code: '',
  });

  const { action: { validateField, isLengthValidated, isTextValidated } } = useValidator();

  async function checkValidationResp(response, field, resultObj) {
    if (response && response.length > 0) {
      for (let x = 0; x < response.length; x++) {
          resultObj[field] = response[x].message;
          if (response[x].message !== '') { return; }
      }
    } else {
      resultObj[field] = '';
    }
  }

  async function validate() {
    const resultObj = {};
    // check language
    const langName = lang.length > 0 && await validateField([isLengthValidated(lang, { minLen: 2, maxLen: 40 }), isTextValidated(lang, 'onlyString')]);
    await checkValidationResp(langName, 'language', resultObj);
    // check Code
    const langCodeName = langCode.length > 0 && await validateField([isLengthValidated(langCode, { minLen: 2, maxLen: 10 }), isTextValidated(langCode, 'onlyString')]);
    await checkValidationResp(langCodeName, 'code', resultObj);
    setErrors(resultObj);
    return resultObj;
  }

  const openLanguageNav = (nav) => {
    logger.debug('TargetLanguagePopover.js', 'In openLanguageNav');
    if (nav === 'edit') {
      logger.debug('TargetLanguagePopover.js', 'Selected a language which can be edited');
      setLock(language?.custom);
      setEdit(true);
      languages.forEach((item) => {
        if (item?.id === language?.id) {
         setId(item.id);
        }
      });
      setLang(language.ang);
      setDirection(language.ld ? language.ld : t('label-rtl'));
      setLangCode(language.lc);
    } else if (nav === 'add') {
      logger.debug('TargetLanguagePopover.js', 'Selected the Pre-defined language which can\'t be edited');
      setLock();
      setEdit(false);
      setLang();
      setDirection(t('label-ltr'));
      setLangCode();
    }
  };
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const addLanguage = async () => {
    logger.debug('TargetLanguagePopover.js', 'Adding a new language');
    // const resultObj = await validate();
    const result = languages.filter((l) => l?.title?.toLowerCase() === lang?.toLowerCase() && l?.scriptDirection?.toLowerCase() === direction.toLowerCase() && l.langCode?.toLowerCase() === langCode?.toLowerCase());
    if (result.length === 0) {
      setLanguage({
 id: languages.length + 1, ang: lang, ld: direction, lc: langCode, custom: true,
});
      openModal();
    } else {
      setNotify('warning');
      setSnackText('Language trying to add is already present');
      setOpenSnackBar(true);
    }
  };
  const editLanguage = () => {
    logger.debug('TargetLanguagePopover.js', 'Editing the language');
    setLanguage({
 id, ang: lang, ld: direction, lc: langCode, custom: true,
});
    closeModal();
  };
  return (
    <>
      <div className="flex gap-3">
        <button
          type="button"
          aria-label="add-language"
          className="focus:outline-none bg-primary h-8 w-8 flex items-center justify-center rounded-full"
          onClick={() => { openLanguageNav('add'); openModal(); }}
        >
          <PlusIcon
            className="h-5 w-5 text-white"
            aria-hidden="true"
          />

        </button>
        {language?.custom === true && (
          <button
            type="button"
            className="focus:outline-none bg-primary h-8 w-8 flex items-center justify-center rounded-full"
            onClick={() => { openLanguageNav('edit'); openModal(); }}
          >
            <PencilSquareIcon
              className="h-5 w-5 text-white"
              aria-hidden="true"
            />
          </button>
        )}
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
              <div className="h-90 w-[26rem] rounded shadow border border-gray-200 bg-white">
                <div className="grid grid-rows-1 gap-5 m-6">
                  <div>
                    <h2 className="uppercase font-bold leading-5 tracking-widest mb-2 ">{edit === true ? t('label-edit-langauge') : t('label-new-langauge')}</h2>
                    <div>
                      <h3 className="mb-1 text-xs font-base  text-primary tracking-wide leading-4 font-light">{t('label-language')}</h3>
                      <input
                        type="text"
                        name="given-name"
                        id="language"
                        autoComplete="given-name"
                        value={lang}
                        onChange={(e) => {
                          setLang(e.target.value);
                        }}
                        disabled={!lock && edit}
                        className="bg-gray-200 w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                      />
                      <span className="text-red-500 ml-2 text-sm">{errors?.lang || errors?.code}</span>

                    </div>
                    <div className="mt-1">
                      <h3 className="mb-1 text-xs font-base  text-primary tracking-wide leading-4 font-light">{t('label-language-code')}</h3>
                      <input
                        type="text"
                        name="given-code"
                        id="code"
                        autoComplete="given-code"
                        value={langCode}
                        onChange={(e) => {
                          setLangCode(e.target.value);
}}
                        disabled={!lock && edit}
                        className="bg-gray-200 w-24 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                      />
                    </div>
                  </div>
                  {projectType !== 'Audio'
                  && (
                    <div>
                      <h3 className="mb-1 text-xs font-base  text-primary tracking-wide leading-4 font-light">{t('label-script-direction')}</h3>
                      <div className="flex items-center justify-start">
                        <div className="">
                          <input
                            type="radio"
                            className="form-radio h-4 w-4 text-primary"
                            value={t('label-ltr')}
                            checked={direction?.toUpperCase() === t('label-ltr')}
                            onChange={() => setDirection(t('label-ltr'))}
                            disabled={!lock && edit}
                          />
                          <span className="ml-2 text-xs font-bold">{t('label-ltr')}</span>
                        </div>
                        <div>
                          <input
                            type="radio"
                            className="form-radio h-4 w-4 text-primary ml-10"
                            value={t('label-rtl')}
                            checked={direction?.toUpperCase() === t('label-rtl')}
                            onChange={() => setDirection(t('label-rtl'))}
                            disabled={!lock && edit}
                          />
                          <span className="ml-2 text-xs font-bold">{t('label-rtl')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="button"
                      aria-label="create-language"
                      onClick={closeModal}
                      className="mr-5 bg-error w-28 h-8 border-color-error rounded
                                  uppercase shadow text-white text-xs tracking-wide leading-4 font-light focus:outline-none"
                    >
                      {t('btn-cancel')}
                    </button>
                    {!lock && edit ? <div />
                    : (
                      <button
                        type="button"
                        aria-label="edit-language"
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

      <SnackBar
        openSnackBar={snackBar}
        snackText={snackText}
        setOpenSnackBar={setOpenSnackBar}
        setSnackText={setSnackText}
        error={notify}
      />

    </>
  );
}
TargetLanguagePopover.propTypes = {
  projectType: PropTypes.string,
};
