import PropTypes from 'prop-types';

concatAudio;
// read audio file
export async function readAudioFile(dirPath) {
  const fs = window.require('fs');
  try {
    const data = fs.readFileSync(dirPath);
    return data;
  } catch (err) {
    console.error(err);
  }
}
readAudioFile.propTypes = {
  dirPath: PropTypes.string.isRequired,
};

export async function concatAudio(audioArr, dirPath, path) {
    // expecting array of audio filename : 1_1.mp3, 1_2.mp3 etc.
    audioArr.sort();
    const mergedAudioBuffer = null;
    // eslint-disable-next-line no-restricted-syntax
    // for (let i = 0; i < audioArr.length; i++) {
    //   // eslint-disable-next-line no-await-in-loop
    //   const currentAudioBuffer = await readAudioFile(path.join(dirPath, audioArr[i]));
    //   if (i > 0) {
    //     const tmp = new Uint8Array(mergedAudioBuffer.byteLength + currentAudioBuffer.byteLength);
    //     tmp.set(new Uint8Array(mergedAudioBuffer), 0);
    //     tmp.set(new Uint8Array(currentAudioBuffer), mergedAudioBuffer.byteLength);
    //     mergedAudioBuffer = tmp.buffer;
    //   } else {
    //     mergedAudioBuffer = currentAudioBuffer;
    //   }
    // }

    return mergedAudioBuffer;
}
concatAudio.propTypes = {
    audioArr: PropTypes.arrayOf(PropTypes.string).isRequired,
    path: PropTypes.string.isRequired,
    mergedAudioName: PropTypes.string.isRequired,
  };
