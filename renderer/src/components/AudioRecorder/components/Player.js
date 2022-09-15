/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */
import {
  TrashIcon,
	MicrophoneIcon,
	ChatIcon,
	RefreshIcon,
	ChevronDownIcon,
	CogIcon,
	MinusIcon,
	PlusIcon,
  StopIcon,
	AnnotationIcon,
	SpeakerphoneIcon,
	ArrowNarrowRightIcon,
	CheckIcon,
	XIcon,
	PencilIcon,
} from '@heroicons/react/outline';
import {
  Listbox,
} from '@headlessui/react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import {
 forwardRef, useCallback, useRef, useState, useEffect,
} from 'react';

import PlayIcon from '@/icons/basil/Outline/Media/Play.svg';
import PauseIcon from '@/icons/basil/Outline/Media/Pause.svg';

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
  return (
    <div className="col-span-7 lg:h-52 bg-black text-white">
      <div className="grid grid-cols-4 lg:grid-cols-9 pt-2 px-4 justify-between items-center">
        <div className="flex flex-col col-span-2 lg:col-span-1 px-10 items-center border-r border-r-gray-800">
          <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
            audio
          </div>
          <button
            type="button"
            className="flex justify-center mt-1 items-center px-2 py-1 text-white
              font-semibold text-xxs rounded-full leading-3 tracking-wider uppercase bg-primary"
          >
            <div className="">
              target
            </div>
          </button>
        </div>

        <div className="flex flex-col col-span-2 lg:col-span-1 px-10 items-center lg:border-r lg:border-r-gray-800">
          <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
            speed
          </div>
          <Listbox value={currentSpeed} onChange={setCurrentSpeed}>
            <Listbox.Button className="flex justify-center mt-1 items-center px-2 py-1 text-white
                      font-semibold text-xxs rounded-full leading-3 tracking-wider uppercase bg-primary"
            >
              {currentSpeed}
              <ChevronDownIcon
                className="w-3 h-3 ml-1"
                aria-hidden="true"
              />
            </Listbox.Button>
            <Listbox.Options>
              {speed.map((s) => (
                <Listbox.Option
                  key={s}
                  value={s}
                >
                  {s}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
        <div className="flex col-span-2 lg:col-span-2 my-4 lg:my-0 gap-5 px-10 justify-center lg:border-r lg:border-r-gray-800">
          <div className="flex flex-col items-center">
            {((trigger === 'record' || trigger === 'recResume') && (
              <>
                <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
                  pause
                </div>
                <button
                  type="button"
                  className="p-2 bg-dark rounded-md hover:bg-error"
                  onClick={() => setTrigger('recPause')}
                >
                  <PauseIcon
                    fill="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                </button>
              </>
            )) || (trigger === 'recPause' && (
              <>
                <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
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
                <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
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
            <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
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

        <div className="flex col-span-4 lg:col-span-3 my-5 lg:my-0 gap-5 px-10 justify-center lg:border-r lg:border-r-gray-800">
          <div className="flex flex-col items-center">
            <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
              rewind
            </div>
            <button
              type="button"
              className="p-2 bg-dark rounded-md hover:bg-error"
              onClick={() => setTrigger('rewind')}
            >
              <RefreshIcon
                className="w-5 h-5"
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
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
            <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
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
            <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
              delete
            </div>
            <button
              type="button"
              className="p-2 bg-dark rounded-md hover:bg-error"
              onClick={() => handleDelete()}
            >
              <TrashIcon
                className="w-5 h-5"
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-xxs mb-2 text-gray-500 uppercase tracking-wider">
              Volume
            </div>
            <div className="flex gap-2 mt-2 items-center justify-center">
              <button
                type="button"
                className="rounded-md hover:bg-primary"
                onClick={() => setVolume(volume < 0.1 ? volume : volume - 0.1)}
              >
                <MinusIcon
                  className="w-4 h-4"
                  aria-hidden="true"
                />
              </button>
              <input type="range" min={0} max={1} step={0.1} value={volume} />
              <button
                type="button"
                className="rounded-md hover:bg-primary"
                onClick={() => setVolume(volume > 0.9 ? volume : volume + 0.1)}
              >
                <PlusIcon
                  className="w-4 h-4"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col col-span-2 lg:col-span-1 px-10 items-center border-r border-r-gray-800">
          <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
            Takes
          </div>
          <div className="flex gap-2">
            <button className={`${take === 'take1' ? 'border-2 border-yellow-400' : ''} w-6 h-6 flex items-center justify-center ${url?.take1 ? (url?.default === 'take1' ? 'bg-primary' : 'bg-success') : 'bg-white'} text-xs font-bold ${url?.take1 ? 'text-white' : 'text-black'} uppercase tracking-wider rounded-full`} onClick={() => changeTake('take1')} onDoubleClick={() => changeDefault(1)}>
              a
            </button>
            <button className={`${take === 'take2' ? 'border-2 border-yellow-400' : ''} w-6 h-6 flex items-center justify-center ${url?.take2 ? (url?.default === 'take2' ? 'bg-primary' : 'bg-success') : 'bg-white'} text-xs font-bold ${url?.take2 ? 'text-white' : 'text-black'} uppercase tracking-wider rounded-full`} onClick={() => changeTake('take2')} onDoubleClick={() => changeDefault(2)}>
              b
            </button>
            <button className={`${take === 'take3' ? 'border-2 border-yellow-400' : ''} w-6 h-6 flex items-center justify-center ${url?.take3 ? (url?.default === 'take3' ? 'bg-primary' : 'bg-success') : 'bg-white'} text-xs font-bold ${url?.take3 ? 'text-white' : 'text-black'} uppercase tracking-wider rounded-full`} onClick={() => changeTake('take3')} onDoubleClick={() => changeDefault(3)}>
              c
            </button>
          </div>
        </div>

        <div className="flex flex-col col-span-2 lg:col-span-1 px-10 items-center justify-center">
          <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
            settings
          </div>
          <div className="flex flex-col items-center">
            <button
              type="button"
              className="p-2 bg-dark rounded-md hover:bg-error"
            >
              <CogIcon
                className="w-5 h-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-5 pt-5 bg-black text-white">
        <AudioWaveform
          height={120}
          barGap="4"
          barWidth="2"
          waveColor="#ffffff"
          btnColor="text-white"
          url={(location && Object.keys(url).length !== 0) && (take ? (url[take] ? path.join(location, url[take]) : '') : path.join(location, url[url?.default]))}
          call={trigger}
          startRecording={startRecording}
          stopRecording={stopRecording}
          pauseRecording={pauseRecording}
          resumeRecording={resumeRecording}
          volume={volume}
          speed={currentSpeed}
          show={false}
        />
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
