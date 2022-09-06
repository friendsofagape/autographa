/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import {
 useEffect, forwardRef, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import WaveSurfer from 'wavesurfer.js';
import { PlayIcon, PauseIcon } from '@heroicons/react/solid';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
// import ReactAudioPlayer from 'react-audio-player';
// eslint-disable-next-line prefer-const
let microphone = MicrophonePlugin.create();
const AudioWaveForm = (props) => {
  const {
    height,
    waveColor,
    url,
    call,
    show,
    startRecording,
    stopRecording,
    btnColor,
    barGap,
    barWidth,
    barRadius,
  } = props;

  const waveformRef = useRef(null);
  // eslint-disable-next-line prefer-const
  let wavesurfer = useRef(null);
  // eslint-disable-next-line prefer-const
  // let microphone = useRef(null);
  const [playing, setPlaying] = useState(false);
  const formWaveSurferOptions = (ref) => ({
    container: ref || '#waveform',
    waveColor,
    progressColor: '#0073E5',
    cursorColor: 'OrangeRed',
    barWidth: barWidth ?? 1,
    barRadius: barRadius ?? 1,
    barGap: barGap ?? 2,
    responsive: true,
    height,
    normalize: true,
    partialRender: true,
    hideScrollbar: true,
    backend: 'MediaElement',
    plugins: [
      microphone,
    ],
  });

  const createForm = async () => {
    // const WaveSurfer = (await import('wavesurfer.js')).default;
    console.log('create');
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url || 'temp.mp3');

    wavesurfer.current.microphone.on('deviceReady', (stream) => {
      console.log('Device ready!', stream);
    });
    wavesurfer.current.microphone.on('deviceError', (code) => {
      console.warn(`Device error: ${ code}`);
    });
  };

  useEffect(() => {
    console.log(url, call);
    if (url || call === 'record') {
      createForm();

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
          wavesurfer.current.microphone.destroy();
        }
      };
    }
  }, [url, call]);

  const handlePlayPause = () => {
    console.log('handleplaypause');
    setPlaying(!playing);
    wavesurfer.current.playPause();
  };
  const handleRewind = () => {
    console.log('stop()');
    wavesurfer.current.stop();
  };
  const handlePlay = () => {
    console.log('handleplay');
    setPlaying(!playing);
    wavesurfer.current.play();
  };
  const handlePause = () => {
    console.log('handlepause');
    setPlaying(!playing);
    wavesurfer.current.pause();
  };
  const handleStart = () => {
    console.log('Starting..............');
    // microphone.current.microphone.on('deviceReady', (stream) => {
    //   console.log('Device ready!', stream);
    // });
    // microphone.current.microphone.on('deviceError', (code) => {
    //   console.warn(`Device error: ${ code}`);
    // });
    startRecording();
    // setRecordingStatus('start');
    wavesurfer.current.microphone.start();
  };
  const handleStop = () => {
    console.log('Stop..............');

    stopRecording();
    wavesurfer.current.microphone.stop();
  };

  useEffect(() => {
    console.log('wave', call, call === 'record', url);
    if (url) {
      switch (call) {
        case 'play':
          handlePlay();
          break;
        case 'pause':
          handlePause();
          break;
        case 'rewind':
          handleRewind();
          break;
        case 'record':
          console.log('yooo');
          handleStart();
          break;
        default:
          break;
      }
    } else {
      switch (call) {
        case 'play':
          handlePlay();
          break;
        case 'pause':
          handleStop();
          break;
        case 'rewind':
          handleRewind();
          break;
        case 'record':
          console.log('yooo');
          handleStart();
          break;
        default:
          break;
      }
    }
  }, [call]);
  return (
    <div className="flex items-center">
      {/* <div id="waveform" ref={waveformRef} /> */}
      {/* <div className="w-full">
        <div id="waveform" ref={waveformRef} />
      </div> */}
      {(url || call === 'record')
        && (
          <>
            <div className="w-full">
              <div id="waveform" ref={waveformRef} />
              <p>yoooo</p>
            </div>
            {show
            && (
            <button type="button" onClick={handlePlayPause}>
              {!playing
              ? (
                <PlayIcon
                  // fill="currentColor"
                  className={`w-7 h-7 ${btnColor}`}
                  aria-hidden="true"
                />
              )
              : (
                <PauseIcon
                  // fill="currentColor"
                  className="w-7 h-7 text-error"
                  aria-hidden="true"
                />
              )}
            </button>
            )}
          </>
      )}
    </div>
  );
};
export default forwardRef(AudioWaveForm);
AudioWaveForm.propTypes = {
  height: PropTypes.number,
  waveColor: PropTypes.string,
  btnColor: PropTypes.string,
  barGap: PropTypes.number,
  barWidth: PropTypes.number,
  barRadius: PropTypes.number,
  url: PropTypes.string,
  show: PropTypes.bool,
};
