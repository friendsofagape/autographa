/* eslint-disable consistent-return */
import Parse from 'parse';

const parseFileSave = async ({
    writeData,
    filename,
    projectMeta,
    filenameAlias,
}) => new Promise((resolve) => {
            const Files = Parse.Object.extend('Files');
            const files = new Files();
                files.set('data', writeData);
                files.set('scope', filename);
                files.set('owner', projectMeta);
                files.set('filenameAlias', filenameAlias);
                files.save();
                resolve('SUCCESS');
    });
export default parseFileSave;
