/* eslint-disable consistent-return */
import Parse from 'parse';

const parseFileSave = async (
    writeData,
    filename,
    projectMeta,
) => {
        const filedata = Array.from(Buffer.from(writeData.toString(), 'binary'));
        const file = new Parse.File(`${filename.replace(/[()]/g, '')}.usfm`, filedata);
        file.addTag('filename', `${filename}.usfm`);
        file.save().then(() => {
            // The file has been saved to Parse.
            // const fileUrl = filedatas.url(); // provide file location
            // fetch(fileUrl)
            //     .then((url) => url.text())
            //     .then((usfmValue) => console.log(usfmValue));
            const Files = Parse.Object.extend('Files');
            const files = new Files();
                files.set('file', file);
                files.set('scope', filename);
                files.set('owner', projectMeta);
                files.save();
        }, (error) => {
            throw error;
        });
};

export default parseFileSave;
