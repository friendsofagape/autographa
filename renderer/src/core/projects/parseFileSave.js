/* eslint-disable consistent-return */
import Parse from 'parse';

const parseFileSave = async (
    writeData,
    filename,
    fileExtention,
    projectMeta,
    filenameAlias,
) => {
    const filedata = {
        base64: Buffer.from(writeData, 'utf-8').toString('base64'),
    };
    return new Promise((resolve) => {
            const file = new Parse.File(`${filename.replace(/[()]/g, '')}.${fileExtention}`, filedata, 'text/plain');
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
                resolve('SUCCESS');
        }, (error) => {
            throw error;
        });
    });
};
export default parseFileSave;
