/* eslint-disable no-useless-escape */
import React, {
  useRef, Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { FolderOpenIcon } from '@heroicons/react/outline';
import * as localforage from 'localforage';
import { useTranslation } from 'react-i18next';
import updateTranslationSB from '@/core/burrito/updateTranslationSB';
import updateObsSB from '@/core/burrito/updateObsSB';
import { SnackBar } from '@/components/SnackBar';
import { mergeAudio } from '@/components/AudioRecorder/core/audioUtils';
import CloseIcon from '@/illustrations/close-button-black.svg';
import { validate } from '../../util/validate';
import * as logger from '../../logger';
import burrito from '../../lib/BurritoTemplete.json';
import ConfirmationModal from '../editor/ConfirmationModal';

const md5 = require('md5');

export default function ExportProjectPopUp(props) {
  const {
    open,
    closePopUp,
    project,
  } = props;
  const { t } = useTranslation();
  const cancelButtonRef = useRef(null);
  const [folderPath, setFolderPath] = React.useState();
  const [valid, setValid] = React.useState(false);
  const [snackBar, setOpenSnackBar] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [notify, setNotify] = React.useState();
  const [openModal, setOpenModal] = React.useState(false);
  const [metadata, setMetadata] = React.useState({});
  const [audioExport, setAudioExport] = React.useState('default');
  const [checkText, setCheckText] = React.useState(false);
  function close() {
    logger.debug('ExportProjectPopUp.js', 'Closing the Dialog Box');
    closePopUp(false);
    setValid(false);
    setMetadata({});
    setCheckText(false);
  }
  const openFileDialogSettingData = async () => {
    logger.debug('ExportProjectPopUp.js', 'Inside openFileDialogSettingData');
    const options = { properties: ['openDirectory'] };
    const { dialog } = window.require('@electron/remote');
    const chosenFolder = await dialog.showOpenDialog(options);
    setFolderPath(chosenFolder.filePaths[0]);
  };

  const updateCommon = (fs, path, folder, project) => {
    const fse = window.require('fs-extra');
    logger.debug('ExportProjectPopUp.js', 'Updated Scripture burrito');
          let data = fs.readFileSync(path.join(folder, 'metadata.json'), 'utf-8');
          const sb = JSON.parse(data);
          if (!sb.copyright?.shortStatements && sb.copyright?.licenses) {
            delete sb.copyright.publicDomain;
            data = JSON.stringify(sb);
          }
          const success = validate('metadata', path.join(folder, 'metadata.json'), data, sb.meta.version);
          if (success) {
            logger.debug('ExportProjectPopUp.js', 'Burrito validated successfully');
            fse.copy(folder, path.join(folderPath, project.name))
              .then(() => {
                logger.debug('ExportProjectPopUp.js', 'Exported Successfully');
                setNotify('success');
                setSnackText(t('dynamic-msg-export-success'));
                setOpenSnackBar(true);
                closePopUp(false);
              })
              .catch((err) => {
                logger.error('ExportProjectPopUp.js', `Failed to export ${err}`);
                setNotify('failure');
                setSnackText(t('dynamic-msg-export-fail'));
                setOpenSnackBar(true);
                closePopUp(false);
              });
          }
  };

  const updateBurritoVersion = (username, fs, path, folder) => {
    if (project?.type === 'Text Translation') {
    updateTranslationSB(username, project, openModal)
        .then(() => {
          updateCommon(fs, path, folder, project);
        });
      } else if (project?.type === 'OBS') {
        updateObsSB(username, project, openModal)
        .then(() => {
          updateCommon(fs, path, folder, project);
        });
      }
    setOpenModal(false);
  };
  async function walk(dir, path, fs) {
    let files = await fs.readdirSync(dir);
    files = await Promise.all(files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stats = await fs.statSync(filePath);
        if (stats.isDirectory()) { return walk(filePath, path, fs); }
        if (stats.isFile()) { return filePath; }
    }));
    return files.reduce((all, folderContents) => all.concat(folderContents), []);
  }
  const exportFullAudio = async (metadata, folder, path, fs) => {
    const AdmZip = window.require('adm-zip');
    const fse = window.require('fs-extra');
    const burrito = metadata;
    const dir = path.join(folderPath, project.name, 'ingredients');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const zip = new AdmZip();
    const directories = fs.readdirSync(path.join(folder, 'audio', 'ingredients'), { withFileTypes: true })
      .filter((item) => item.isDirectory())
      .map((item) => item.name);
    directories.forEach((sourceDir) => {
      zip.addLocalFolder(path.join(folder, 'audio', 'ingredients', sourceDir), sourceDir);
    });
    zip.writeZip(path.join(dir, 'ag_internal_audio.zip'));
    const list = await walk(path.join(folder, 'audio', 'ingredients'), path, fs);
    const otherFiles = list.filter((name) => !name.includes('.mp3') && !name.includes('.wav'));
    await otherFiles.forEach(async (file) => {
      const filePath = file.split(/[\/\\]ingredients[\/\\]/)[1];
      await fse.copy(file, path.join(folderPath, project.name, 'ingredients', filePath));
    });
    const renames = Object.keys(burrito.ingredients).filter((key) => key.includes('audio'));
    await renames?.forEach((rename) => {
      burrito.ingredients[rename.replace(/audio[\/\\]/, '')] = burrito.ingredients[rename];
      delete burrito.ingredients[rename];
    });
    const content = fs.readFileSync(path.join(dir, 'ag_internal_audio.zip'), 'utf8');
    const stats = fs.statSync(path.join(dir, 'ag_internal_audio.zip'));
    burrito.ingredients[path.join('ingredients', 'ag_internal_audio.zip')] = {
      checksum: {
        md5: md5(content),
      },
      mimeType: 'application/zip',
      size: stats.size,
    };
    await fs.writeFileSync(path.join(folderPath, project.name, 'metadata.json'), JSON.stringify(burrito));
    logger.debug('ExportProjectPopUp.js', 'Exported Successfully');
    setNotify('success');
    setSnackText(t('dynamic-msg-export-success'));
    setOpenSnackBar(true);
    closePopUp(false);
  };

  const writeAndUpdateBurritoDefaultExport = async (audio, path, mp3ExportPath, fs, fse, book, verse, burrito) => {
    await fse.copy(audio, path.join(folderPath, project.name, mp3ExportPath))
      .then(async () => {
        logger.debug('ExportProjectPopUp.js', 'Creating the ingredients.');
        const content = fs.readFileSync(path.join(folderPath, project.name, mp3ExportPath), 'utf8');
        const stats = fs.statSync(path.join(folderPath, project.name, mp3ExportPath));
        burrito.ingredients[mp3ExportPath] = {
          checksum: {
            md5: md5(content),
          },
          mimeType: 'audio/mp3',
          size: stats.size,
          scope: {},
        };
        burrito.ingredients[mp3ExportPath].scope[book] = [verse.replace('_', ':')];
      }).catch((err) => logger.error('ExportProjectPopUp.js', `${err}`));
  };

  const exportChapterAudio = async (defaultAudio, burrito, fs, fse, path, folder) => {
    const audioObj = {};
    // eslint-disable-next-line
    for (const audio of defaultAudio) {
      const book = audio.split(/[\/\\]/).slice(-3)[0];
      const chapter = audio.split(/[\/\\]/).slice(-2)[0];
      const url = audio.split(/[\/\\]/).slice(-1)[0];
      // eslint-disable-next-line no-await-in-loop
      if (book in audioObj && chapter in audioObj[book]) {
          audioObj[book][chapter].push(url);
      } else if (!(book in audioObj)) {
          audioObj[book] = { [chapter]: new Array(url) };
      } else if (book in audioObj && !(chapter in audioObj[book])) {
          audioObj[book][chapter] = new Array(url);
      }
    }
    // loop the book and chapter to generate merged audio of chapter
    // eslint-disable-next-line no-restricted-syntax
    for (const bk in audioObj) {
      if (Object.prototype.hasOwnProperty.call(audioObj, bk)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const ch in audioObj[bk]) {
          if (Object.prototype.hasOwnProperty.call(audioObj[bk], ch)) {
            const extension = audioObj[bk][ch][0].split('.').pop();
            const audioName = `${ch}.${extension}`;
            const audioExportPath = path.join(folderPath, project.name, 'ingredients', bk);
            // eslint-disable-next-line no-await-in-loop
            await mergeAudio(audioObj[bk][ch], path.join(folder, 'audio', 'ingredients', bk, ch), path, bk, ch)
            .then(async ([mergedAudioBlob, timeStampData]) => {
              logger.debug('ExportProjectPopUp.js', `generated merged audio for ${bk} : ${ch}`);
              // Write Merge Audio
              fs.mkdirSync(audioExportPath, { recursive: true });
              // eslint-disable-next-line no-await-in-loop
              await fs.writeFileSync(path.join(audioExportPath, audioName), Buffer.from(new Uint8Array(mergedAudioBlob)));
              logger.debug('ExportProjectPopUp.js', 'Generated audio written to folder');
                const content = fs.readFileSync(path.join(audioExportPath, audioName), 'utf8');
                const stats = fs.statSync(path.join(audioExportPath, audioName));
                burrito.ingredients[path.join('ingredients', bk, audioName)] = {
                  checksum: {
                    md5: md5(content),
                  },
                  mimeType: 'audio/mp3',
                  size: stats.size,
                  scope: {},
                };
                burrito.ingredients[path.join('ingredients', bk, audioName)].scope[bk] = [];
                logger.debug('ExportProjectPopUp.js', 'Burrito updated for generated Audio');
                // Write TimeStamp
                fs.mkdirSync(path.join(folderPath, project.name, 'time stamps'), { recursive: true });
                await fs.writeFileSync(path.join(folderPath, project.name, 'time stamps', timeStampData[0]), timeStampData[1], 'utf-8');
            });
          }
        }
      }
    }
  };

  const exportDefaultAudio = async (metadata, folder, path, fs) => {
    const fse = window.require('fs-extra');
    const burrito = metadata;
    const list = await walk(path.join(folder, 'audio', 'ingredients'), path, fs);
    const defaultAudio = list.filter((name) => name.includes('_default'));
    const otherFiles = list.filter((name) => !name.includes('.mp3') && !name.includes('.wav'));
    if (audioExport === 'default') {
      // Unable to use forEach, since forEach doesn't wait to finish the loop
    // eslint-disable-next-line
      for (const audio of defaultAudio) {
        const book = audio.split(/[\/\\]/).slice(-3)[0];
        const chapter = audio.split(/[\/\\]/).slice(-2)[0];
        const url = audio.split(/[\/\\]/).slice(-1)[0];
        const mp3 = url.replace(/_\d_default/, '');
        const verse = mp3.replace('.mp3', '');
        const mp3ExportPath = path.join('ingredients', book, chapter, mp3);
        // console.log({
        // book, chapter, url, mp3, verse,
        // });
        // eslint-disable-next-line
        await writeAndUpdateBurritoDefaultExport(audio, path, mp3ExportPath, fs, fse, book, verse, burrito);
      }
    } else if (audioExport === 'chapter') {
      await exportChapterAudio(defaultAudio, burrito, fs, fse, path, folder);
    }
    // We need to execute these loop before going to next line so 'for' is used instead of 'forEach'
    // eslint-disable-next-line no-restricted-syntax
    for (const file of otherFiles) {
      const filePath = file.split(/[\/\\]ingredients[\/\\]/)[1];
      fse.copySync(file, path.join(folderPath, project.name, 'ingredients', filePath));
    }
    // Wants to export the TEXT along with the project so not updating the file path
    if (!checkText) {
      const renames = Object.keys(burrito.ingredients).filter((key) => key.includes('audio'));
      await renames?.forEach((rename) => {
        burrito.ingredients[rename.replace(/audio[\/\\]/, '')] = burrito.ingredients[rename];
        delete burrito.ingredients[rename];
      });
    }
    await fs.writeFileSync(path.join(folderPath, project.name, 'metadata.json'), JSON.stringify(burrito));
    if (checkText && fs.existsSync(path.join(folder, 'text-1'))) {
      await fse.copySync(path.join(folderPath, project.name, 'ingredients'), path.join(folderPath, project.name, 'audio', 'ingredients'));
      await fse.copySync(path.join(folder, 'text-1'), path.join(folderPath, project.name, 'text-1'));
      await fs.rmSync(path.join(folderPath, project.name, 'ingredients'), { recursive: true, force: true });
    }

    logger.debug('ExportProjectPopUp.js', 'Exported Successfully');
    setNotify('success');
    setSnackText(t('dynamic-msg-export-success'));
    setOpenSnackBar(true);
    closePopUp(false);
    setCheckText(false);
  };

  const exportBible = async () => {
    const fs = window.require('fs');
    if (folderPath && fs.existsSync(folderPath)) {
      setValid(false);
      logger.debug('ExportProjectPopUp.js', 'Inside exportBible');
      await localforage.getItem('userProfile').then((value) => {
        const path = require('path');
        const newpath = localStorage.getItem('userPath');
        const folder = path.join(newpath, 'autographa', 'users', value.username, 'projects', `${project.name}_${project.id[0]}`);
        const data = fs.readFileSync(path.join(folder, 'metadata.json'), 'utf-8');
        const metadata = JSON.parse(data);
        const { username } = value;
        setMetadata({
          metadata, folder, path, fs, username,
        });
        if (project?.type === 'Audio') {
          if (audioExport === 'default' || audioExport === 'chapter') {
            exportDefaultAudio(metadata, folder, path, fs);
          } else {
            exportFullAudio(metadata, folder, path, fs);
          }
        } else if (burrito?.meta?.version !== metadata?.meta?.version) {
            setOpenModal(true);
          } else {
            updateBurritoVersion(username, fs, path, folder);
          }
      });
    } else {
      logger.warn('ExportProjectPopUp.js', 'Invalid Path');
      setValid(true);
      setNotify('failure');
      setSnackText(t('dynamic-msg-invalid-path'));
      setOpenSnackBar(true);
    }
  };
  return (
    <>
      <Transition
        show={open}
        as={Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          initialFocus={cancelButtonRef}
          static
          open={open}
          onClose={close}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="flex items-center justify-center h-screen">
            <div className="w-5/12 h-3/6 items-center justify-center m-auto z-50 shadow overflow-hidden rounded">
              <div className="relative h-full rounded shadow overflow-hidden bg-white">
                <div className="flex justify-between items-center bg-secondary">
                  <div className="uppercase bg-secondary text-white py-2 px-2 text-xs tracking-widest leading-snug rounded-tl text-center">
                    {t('label-export-project')}
                    :
                    {
                    `${project?.name}`
                    }
                  </div>
                  <button
                    onClick={close}
                    type="button"
                    className="focus:outline-none"
                  >
                    <CloseIcon
                      className="h-6 w-7"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div className="relative w-full h-5/6">
                  <div className="p-8 overflow-auto w-full h-full no-scrollbars">
                    <div className="bg-white text-sm text-left tracking-wide">
                      <h4 className="text-xs font-base mb-2 text-primary  tracking-wide leading-4  font-light">Export file path</h4>
                      <div className="flex items-center mb-4">
                        <input
                          type="text"
                          name="location"
                          id=""
                          value={folderPath}
                          onChange={(e) => setFolderPath(e.target.value)}
                          className="bg-white w-52 lg:w-80 block rounded shadow-sm sm:text-sm focus:border-primary border-gray-300"
                        />
                        <button
                          type="button"
                          title={t('tooltip-import-open-file-location')}
                          className="px-5"
                          onClick={() => openFileDialogSettingData()}
                        >
                          <FolderOpenIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-red-500">{valid === true ? 'Enter valid location' : ''}</h4>
                    </div>
                    { project?.type === 'Audio'
                    && (
                    <div>
                      <div className=" mb-3">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-primary"
                          value="Default"
                          checked={audioExport === 'default'}
                          onChange={() => setAudioExport('default')}
                        />
                        <span className=" ml-4 text-xs font-bold" title="Verse-wise export with only the default take of each verse kept as a Scripture Burrito">Verse-wise Default</span>
                        <div className="flex flex-row justify-end mr-3">
                          <input id="visible_1" className="visible" type="checkbox" checked={checkText} onClick={() => setCheckText(!checkText)} />
                          <span className="ml-2 text-xs font-bold" title="You can have the text content along with the Audio">With Text (if available)</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-primary"
                          value="Chapter"
                          checked={audioExport === 'chapter'}
                          onChange={() => setAudioExport('chapter')}
                        />
                        <span className=" ml-4 text-xs font-bold" title="Chapter Level export with only the default take of each verse">Chapter-wise Default</span>
                      </div>
                      <hr className="border-2" />
                      <div className="mt-3">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-primary"
                          value="full"
                          checked={audioExport === 'full'}
                          onChange={() => setAudioExport('full')}
                        />
                        <span className=" ml-4 text-xs font-bold" title="All takes of every verse saved as a ZIP archive within Scripture Burrito">Full project</span>
                      </div>
                    </div>
                    )}
                    <div className="absolute bottom-0 right-0 left-0 bg-white">
                      <div className="flex gap-6 mx-5 justify-end">
                        <button type="button" className="py-2 px-6 rounded shadow bg-error text-white uppercase text-xs tracking-widest font-semibold" onClick={close}>{t('btn-cancel')}</button>
                        <button
                          onClick={() => exportBible()}
                          type="button"
                          className="py-2 px-7 rounded shadow bg-success text-white uppercase text-xs tracking-widest font-semibold"
                        >
                          {t('btn-export')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
      <SnackBar
        openSnackBar={snackBar}
        snackText={snackText}
        setOpenSnackBar={setOpenSnackBar}
        setSnackText={setSnackText}
        error={notify}
      />
      <ConfirmationModal
        openModal={openModal}
        title={t('modal-title-update-burrito')}
        setOpenModal={setOpenModal}
        confirmMessage={t('dynamic-msg-update-burrito-version', { version1: metadata?.metadata?.meta?.version, version2: burrito?.meta?.version })}
        buttonName={t('btn-update')}
        closeModal={
          () => updateBurritoVersion(metadata.username, metadata.fs, metadata.path, metadata.folder)
        }
      />
    </>
  );
}
ExportProjectPopUp.propTypes = {
  open: PropTypes.bool,
  closePopUp: PropTypes.func,
  project: PropTypes.object,
};
