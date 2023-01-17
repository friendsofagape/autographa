import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

export default function AudioWaveForm(props) {
  const {
    height,
    waveColor,
    btnColor,
    barGap,
    barWidth,
    barRadius,
  } = props;

  const formWaveSurferOptions = (ref) => ({
    container: ref,
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
  });

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);

  const url = 'https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3';

  const create = async () => {
    const WaveSurfer = (await import('wavesurfer.js')).default;

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);
  };

  useEffect(() => {
    create();

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  const handlePlayPause = () => {
    setPlaying(!playing);
    wavesurfer.current.playPause();
  };

  return (
    <div className="flex items-center">
      <div className="w-full">
        <div id="waveform" ref={waveformRef} />
      </div>
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
    </div>
  );
}

AudioWaveForm.propTypes = {
  height: PropTypes.number,
  waveColor: PropTypes.string,
  btnColor: PropTypes.string,
  barGap: PropTypes.number,
  barWidth: PropTypes.number,
  barRadius: PropTypes.number,
};
