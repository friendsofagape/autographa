/* eslint-disable no-nested-ternary */
import {
  TrashIcon,
  MicrophoneIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  CogIcon,
  MinusIcon,
  PlusIcon,
  StopIcon,
} from '@heroicons/react/24/outline';
import { Listbox } from '@headlessui/react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useState } from 'react';
import PlayIcon from '@/icons/basil/Outline/Media/Play.svg';
import PauseIcon from '@/icons/basil/Outline/Media/Pause.svg';
import SpeechRecognition from '../SpeechRecognitionWebApi/SpeechRecognition';

const AudioWaveform = dynamic(() => import('./WaveForm'), { ssr: false });

const Player = ({
  url,
  startRecording,
  stopRecording,
  pauseRecording,
  resumeRecording,
  take,
  setTake,
  changeDefault,
  setOpenModal,
  trigger,
  setTrigger,
  location,
}) => {
  const [volume, setVolume] = useState(0.5);
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const speed = [0.5, 1, 1.5, 2];
  const path = require('path');
  const handleRecord = () => {
    // check whether its a first record or re-recording
    if (url[take]) {
      setOpenModal({
        openModel: true,
        title: 'Re-record the Audio',
        confirmMessage: 'Do you want to re-record the audio',
        buttonName: 'Re-record',
      });
    } else {
      // Recording for the first time
      setTrigger('record');
    }
  };
  const handleDelete = () => {
    // check whether its a first record or re-recording
    if (url[take]) {
      setOpenModal({
        openModel: true,
        title: 'Delete the Audio',
        confirmMessage: 'Do you want to delete the selected take',
        buttonName: 'Delete',
      });
      setTrigger('delete');
    }
  };
  const changeTake = (value) => {
    setTake(value);
    setTrigger();
  };
  const micSettings = () => {
    const { shell } = window.require('electron');
    shell.openExternal('ms-settings:sound');
    shell.openExternal('x-apple.systempreferences:');
  };
  return (
    <div className="relative">
      <div className="relative bottom-0">
        <div className="grid grid-flow-col auto-cols-fr text-white bg-black transparent p-1 justify-between items-center">
          <div className="flex flex-col px-10 items-center border-r border-r-gray-800">
            <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
              audio
            </div>
            <button
              type="button"
              className="flex justify-center mt-1 items-center px-2 py-1 text-white
            font-semibold text-xxs rounded-full leading-3 tracking-wider uppercase bg-primary"
            >
              <div className="">target</div>
            </button>
          </div>
          <div className="flex flex-col px-10 items-center border-r border-r-gray-800">
            <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
              speed
            </div>
            <Listbox value={currentSpeed} onChange={setCurrentSpeed}>
              <Listbox.Button
                className="flex justify-center z-10 items-center px-2 py-1 text-white
                    font-semibold text-xxs rounded-full leading-3 tracking-wider uppercase bg-primary"
              >
                {currentSpeed}
                <ChevronDownIcon
                  className="w-3 h-3 ml-1"
                  aria-hidden="true"
                />
              </Listbox.Button>
              <Listbox.Options className="grid grid-flow-col auto-cols-fr overflow-auto rounded-md mt-0.5 border-2 lg:w-32 md:w-28 items-center text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {speed.map((s) => (
                  <Listbox.Option
                    key={s}
                    value={s}
                    className="flex p-1 hover:bg-gray-300 hover:text-black cursor-pointer"
                  >
                    {s}
                  </Listbox.Option>
            ))}
              </Listbox.Options>
            </Listbox>
          </div>
          <div className="flex flex-row items-center justify-evenly border-r border-r-gray-800">
            <div className="flex flex-col items-center">
              {((trigger === 'record' || trigger === 'recResume') && (
              <>
                <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
                  pause
                </div>
                <button
                  type="button"
                  className="p-2 bg-error rounded-md hover:bg-dark"
                  onClick={() => setTrigger('recPause')}
                >
                  <PauseIcon
                    fill="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                </button>
              </>
          ))
            || (trigger === 'recPause' && (
              <>
                <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
                  continue
                </div>
                <button
                  type="button"
                  className="p-2 bg-dark rounded-md hover:bg-error"
                  onClick={() => setTrigger('recResume')}
                >
                  <PlayIcon
                    fill="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                </button>
              </>
            )) || (
              <>
                <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
                  record
                </div>
                <button
                  type="button"
                  className="p-2 bg-dark rounded-md hover:bg-error"
                  onClick={() => handleRecord()}
                >
                  <MicrophoneIcon
                    className="w-5 h-5 text-white"
                    aria-hidden="true"
                  />
                </button>
              </>
            )}
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
                stop
              </div>
              <button
                type="button"
                className="p-2 bg-dark rounded-md hover:bg-primary"
                onClick={() => setTrigger('recStop')}
              >
                <StopIcon
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-row lg:gap-5 md:gap-2 md:col-span-3 col-span-4 px-10 justify-center items-center border-r border-r-gray-800">
            <div className="flex flex-col items-center">
              <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
                rewind
              </div>
              <button
                type="button"
                className="p-2 bg-dark rounded-md hover:bg-error"
                onClick={() => setTrigger('rewind')}
              >
                <ArrowPathIcon
                  className="w-5 h-5"
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
                play
              </div>
              <button
                type="button"
                className="p-2 bg-dark rounded-md hover:bg-primary"
                onClick={() => setTrigger('play')}
              >
                <PlayIcon
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
                pause
              </div>
              <button
                type="button"
                className="p-2 bg-dark rounded-md hover:bg-primary"
                onClick={() => setTrigger('pause')}
              >
                <PauseIcon
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
                delete
              </div>
              <div>
                <button
                  type="button"
                  className="p-2 bg-dark rounded-md hover:bg-error"
                  onClick={() => handleDelete()}
                >
                  <TrashIcon className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xxs mb-2 text-gray-300 uppercase tracking-wider">
                Volume
              </div>
              <div className="flex gap-2 mt-2 items-center justify-center">
                <button
                  type="button"
                  className="rounded-md hover:bg-primary"
                  onClick={() => setVolume(
                  volume < 0.1 ? volume : volume - 0.1,
                )}
                >
                  <MinusIcon
                    className="w-4 h-4"
                    aria-hidden="true"
                  />
                </button>
                <input
                  type="range"
                  className="md:w-12 w-full xl:w-44"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                />
                <button
                  type="button"
                  className="rounded-md hover:bg-primary"
                  onClick={() => setVolume(
                  volume > 0.9 ? volume : volume + 0.1,
                )}
                >
                  <PlusIcon
                    className="w-4 h-4"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col px-10 items-center border-r border-r-gray-800">
            <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
              Takes
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`${
              take === 'take1'
                ? 'border-2 border-yellow-400'
                : ''
            } w-6 h-6 flex items-center justify-center ${
              url?.take1
                ? url?.default === 'take1'
                  ? 'bg-primary'
                  : 'bg-success'
                : 'bg-white'
            } text-xs font-bold ${
              url?.take1 ? 'text-white' : 'text-black'
            } uppercase tracking-wider rounded-full`}
                onClick={() => changeTake('take1')}
                onDoubleClick={() => changeDefault(1)}
              >
                a
              </button>
              <button
                type="button"
                className={`${
              take === 'take2'
                ? 'border-2 border-yellow-400'
                : ''
            } w-6 h-6 flex items-center justify-center ${
              url?.take2
                ? url?.default === 'take2'
                  ? 'bg-primary'
                  : 'bg-success'
                : 'bg-white'
            } text-xs font-bold ${
              url?.take2 ? 'text-white' : 'text-black'
            } uppercase tracking-wider rounded-full`}
                onClick={() => changeTake('take2')}
                onDoubleClick={() => changeDefault(2)}
              >
                b
              </button>
              <button
                type="button"
                className={`${
              take === 'take3'
                ? 'border-2 border-yellow-400'
                : ''
            } w-6 h-6 flex items-center justify-center ${
              url?.take3
                ? url?.default === 'take3'
                  ? 'bg-primary'
                  : 'bg-success'
                : 'bg-white'
            } text-xs font-bold ${
              url?.take3 ? 'text-white' : 'text-black'
            } uppercase tracking-wider rounded-full`}
                onClick={() => changeTake('take3')}
                onDoubleClick={() => changeDefault(3)}
              >
                c
              </button>
            </div>
          </div>
          <div className="flex flex-col px-10 items-center">
            <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
              settings
            </div>
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="p-2 bg-dark rounded-md hover:bg-error"
                onClick={() => micSettings()}
              >
                <CogIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          {/* speech section */}
          <div className="flex flex-col px-10 items-center border-l border-l-gray-800">
            <div className="text-xxs text-gray-300 uppercase tracking-wider mb-2">
              Speech
            </div>
            <div className="flex flex-col items-center">
              <SpeechRecognition trigger={trigger} />
            </div>
          </div>

        </div>
        <div className="border-t border-gray-800 bg-black text-white">
          <AudioWaveform
            height={28}
            barGap="4"
            barWidth="2"
            waveColor="#ffffff"
            btnColor="text-white"
        // url={(location && Object.keys(url).length !== 0) && (take ? (url[take] ? url[take] : '') : url[url?.default])}
            url={
          location
          && Object.keys(url).length !== 0
          && (take
            ? url[take]
              ? path.join(location, url[take])
              : ''
            : path.join(location, url[url?.default]))
        }
            call={trigger}
            startRecording={startRecording}
            stopRecording={stopRecording}
            pauseRecording={pauseRecording}
            resumeRecording={resumeRecording}
            volume={volume}
            speed={currentSpeed}
            show={false}
            setTrigger={setTrigger}
          />
        </div>
      </div>
    </div>
  );
};
export default Player;
Player.propTypes = {
url: PropTypes.object,
startRecording: PropTypes.any,
stopRecording: PropTypes.any,
pauseRecording: PropTypes.any,
resumeRecording: PropTypes.any,
take: PropTypes.string,
setTake: PropTypes.any,
changeDefault: PropTypes.func,
setOpenModal: PropTypes.func,
trigger: PropTypes.string,
setTrigger: PropTypes.any,
location: PropTypes.any,
};
