// Check the given row column reference Offline / downloaded resource folder and meta exist or not
// If not exist remove reference from the Ag setting reference of the Project
import localforage from 'localforage';

function isBackendProjectExist(ProjectDir) {
    const newpath = localStorage.getItem('userPath');
    const fs = window.require('fs');
    const path = require('path');
    //     fs.mkdirSync(path.join(newpath, 'autographa', 'users', username, 'projects', projectname), {
        //         recursive: true,
        //     });
        //     filenames.forEach((files) => {
            //         fs.closeSync(fs.openSync(path.join(newpath, 'autographa', 'users', username, 'projects', projectname, `${files}.usfm`), 'w'));
    //     });

    // Step1 : check the project Dir and Meta exist
    // step2 : exist return True
    // step3 : delete reference from current project (remove resource fucntion call)
    return new Promise((resolve) => {
        // let checkStatus = false;
        localforage.getItem('userProfile').then((value) => {
            console.log('inside local =====> 1');
            if (value?.username) {
                console.log('inside if =====> 2');
                const resourcePath = path.join(newpath, 'autographa', 'users', value.username, 'resources', ProjectDir);
                // console.log({
                //     ProjectDir, projectName, newpath, value,
                // });
                // console.log('path : ', resourcePath);
                // check for path exist or not and resolve true or false will work for pane 1 now add for other panes
                if (fs.existsSync(resourcePath) && fs.existsSync(path.join(resourcePath, 'metadata.json'))) {
                    console.log('inside exist path =====> 3');
                    // checkStatus = true;
                    resolve(true);
                } else {
                    console.log('inside else faield exist ========');
                    resolve(false);
                }
            }
        });
    });
}
export default isBackendProjectExist;
