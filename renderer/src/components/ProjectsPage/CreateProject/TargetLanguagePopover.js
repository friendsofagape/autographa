import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ProjectContext } from '../../context/ProjectContext';

export default function TargetLanguagePopover() {
  const [id, setId] = React.useState();
  const [lang, setLang] = React.useState();
  const [direction, setDirection] = React.useState();
  const [edit, setEdit] = React.useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const {
    states: {
      language,
      languages,
    }, actions: { setLanguage },
  } = React.useContext(ProjectContext);
  // eslint-disable-next-line no-unused-vars
  const openLanguageNav = (nav) => {
    if (nav === 'edit') {
      setEdit(true);
      setId(language.id);
      setLang(language.title);
      setDirection(language.scriptDirection ? language.scriptDirection : 'LTR');
    } else {
      setEdit(false);
      setLang();
      setDirection('LTR');
    }
  };
  const addLanguage = () => {
    setLanguage({ id: languages.length + 1, title: lang, scriptDirection: direction });
  };
  // eslint-disable-next-line no-unused-vars
  const editLanguage = () => {
    setLanguage({ id, title: lang, scriptDirection: direction });
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  return (
    <>
      <div className="flex gap-3">
        <button
          className="focus:outline-none"
          type="button"
        // onClick={() => openLanguageNav('add')}
          onClick={openModal}
        >
          <img
            src="illustrations/add-button.svg"
            alt="add button"
          />

        </button>
        <button
          type="button"
          className="focus:outline-none"
        // onClick={() => openLanguageNav('edit')}
          onClick={openModal}
        >
          <img
            src="illustrations/edit.svg"
            alt="edit button"
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
                    <h2 className="uppercase font-bold leading-5 tracking-widest mb-5 ">new langauge</h2>
                    <div>
                      <input
                        type="text"
                        name="search_box"
                        id="search_box"
                        autoComplete="given-name"
                        value={lang}
                        onChange={(e) => { setLang(e.target.value); }}
                        className="bg-gray-200 w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs font-base  text-primary tracking-wide leading-4 font-light">Script Direction</h3>
                    <div>
                      <div className=" mb-3">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-primary"
                          value="LTR"
                          checked={direction === 'LTR'}
                          onChange={() => setDirection('LTR')}
                        />
                        <span className=" ml-4 text-xs font-bold">LTR</span>
                      </div>
                      <div>
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-primary"
                          value="RTL"
                          checked={direction === 'RTL'}
                          onChange={() => setDirection('RTL')}
                        />
                        <span className=" ml-3 text-xs font-bold">RTL</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-16">
                    <button type="button" onClick={closeModal} className="mr-5 bg-error w-28 h-8 border-color-error rounded uppercase shadow text-white text-xs tracking-wide leading-4 font-light focus:outline-none"> cancel</button>
                    <button
                      type="button"
                      className=" bg-success w-28 h-8 border-color-success rounded uppercase text-white text-xs shadow focus:outline-none"
                      onClick={() => { addLanguage(); closeModal(); }}
                    >
                      {edit ? 'save' : 'create'}
                    </button>
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
