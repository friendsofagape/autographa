/* eslint-disable consistent-return */
import Parse from 'parse';

const parseFileSave = async (
    writeData,
    filename,
    fileExtention,
    projectMeta,
    filenameAlias,
) => {
        const filedata = Array.from(Buffer.from(writeData.toString(), 'binary'));
        const file = new Parse.File(`${filename.replace(/[()]/g, '')}.${fileExtention}`, filedata);
        file.addTag('filename', `${filename}.${fileExtention}`);
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
                files.set('filenameAlias', filenameAlias);
                files.save();
                return file;
        }, (error) => {
            throw error;
        });
};

export default parseFileSave;
