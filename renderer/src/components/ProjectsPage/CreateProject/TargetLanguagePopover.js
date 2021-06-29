import React from 'react';
import { Popover } from '@headlessui/react';
import { ProjectContext } from '../../context/ProjectContext';

export default function TargetLanguagePopover() {
  const [lang, setLang] = React.useState();
  const [direction, setDirection] = React.useState();
  const [edit, setEdit] = React.useState(false);
  const {
    states: {
      language,
    }, actions: { setLanguage },
  } = React.useContext(ProjectContext);
  const openLanguageNav = (nav) => {
    if (nav === 'edit') {
      setEdit(true);
      setLang(language.title);
      setDirection(language.scriptDirection ? language.scriptDirection : 'LTR');
    } else {
      setEdit(false);
      setLang();
      setDirection('LTR');
    }
  };
  const addLanguage = () => {
    setLanguage({ title: lang, scriptDirection: direction });
  };
  return (
    <Popover className="relative ">
      {({ open }) => (
        <>
          <Popover.Group>
            <Popover.Button className="focus:outline-none"
            onClick={() => openLanguageNav('add')}
            >
                <img
                  src="illustrations/add-button.svg"
                  alt="add button"
                />
             
            </Popover.Button>
            <Popover.Button
            className="focus:outline-none"
            onClick={() => openLanguageNav('edit')}
            
            >
                <img
                  src="illustrations/edit.svg"
                  alt="edit button"
                />
            </Popover.Button>
            </Popover.Group>
          <Popover.Overlay
            className={`${
              open ? 'opacity-30 fixed inset-0' : 'opacity-0'
            } bg-black`}
          />
          <Popover.Panel className="absolute z-20 bottom-36 right-8">
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
                  <Popover.Button className="mr-5 bg-error w-28 h-8 border-color-error rounded uppercase shadow text-white text-xs tracking-wide leading-4 font-light"> cancel</Popover.Button>
                  <Popover.Button
                    type="button"
                    className=" bg-success w-28 h-8 border-color-success rounded uppercase text-white text-xs shadow"
                    onClick={() => addLanguage()}

                  >
                    {edit ? 'save' : 'create'}
                  </Popover.Button>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </>
       )}
    </Popover>
  );
}
