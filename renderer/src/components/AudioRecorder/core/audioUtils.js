import ConcatAudio from './concatAudio';
import * as logger from '../../../logger';

function sec_to_min_sec_milli_convertor(time) {
    logger.debug('audioUtils.js', 'In  time conversion function');
    let milliseconds = time.toString().split('.')[1];
    if (milliseconds === undefined) {
        milliseconds = '0';
    }
    const minutes = Math.floor(time / 60);
    const seconds = (time - minutes * 60).toString().split('.')[0].padStart(2, 0);
    const formatedStringTime = `${minutes.toString().padStart(2, 0)}:${seconds}:${milliseconds.padStart(2, 0)}`;
    return [minutes, seconds, milliseconds, formatedStringTime];
}

async function generateTimeStampData(buffers, book, chapter) {
    logger.debug('audioUtils.js', 'In TimeStamp Generation');
    return new Promise((resolve) => {
        let fileString = 'verse_number\tstart_timestamp\tduration\n';
        const seperator = '\t';
        const fileType = 'tsv';
        const file = `${book}_${chapter.toString().padStart(3, 0)}.${fileType}`;
        let start = 0;
        buffers.forEach((buffer, index) => {
            const currentVerse = `Verse_${(index + 1).toString().padStart(2, 0)}`;
            const startTimeString = sec_to_min_sec_milli_convertor(start)[3];
            const durationString = sec_to_min_sec_milli_convertor(buffer.duration)[3];
            fileString += `${currentVerse + seperator + startTimeString + seperator + durationString}\n`;
            start += buffer.duration;
        });
        resolve([file, fileString]);
    });
}

export async function mergeAudio(audioArr, dirPath, path, book, chapter) {
    logger.debug('audioUtils.js', 'In Merge Audio fucntion');
    const audio = new ConcatAudio(window);
    return new Promise((resolve) => {
        let merged;
        let output;
        audioArr.sort();
        for (let i = 0; i < audioArr.length; i++) {
            audioArr[i] = path.join(dirPath, audioArr[i]);
        }
        logger.debug('audioUtils.js', 'start merging audios');
        audio.fetchAudio(...audioArr)
        .then(async (buffers) => {
            // generate timestamp data string
            await generateTimeStampData(buffers, book, chapter)
            .then((timeStampData) => {
                // merging all buffers
                merged = audio.concatAudio(buffers);
                return [merged, timeStampData];
            })
            .then(async ([merged, timeStampData]) => {
                output = audio.export(merged, 'audio/mp3');
                logger.debug('audioUtils.js', `return Merged Audio for chapter : ${book} : ${chapter}`);
                resolve([output.blob, timeStampData]);
            });
        });
    });
}
