import localforage from 'localforage';

function isBackendProjectExist(ProjectDir) {
    const newpath = localStorage.getItem('userPath');
    const fs = window.require('fs');
    const path = require('path');
    // Step1 : check the project Dir and Meta exist
    // step2 : exist return True
    return new Promise((resolve) => {
        // let checkStatus = false;
        localforage.getItem('userProfile').then((value) => {
            console.log('inside local =====> 1');
            if (value?.username) {
                console.log('inside if =====> 2');
                const resourcePath = path.join(newpath, 'autographa', 'users', value.username, 'resources', ProjectDir);
                console.log('DIR : ', { ProjectDir });
                // check for path exist or not and resolve true or false will work for pane 1 now add for other panes
                if (fs.existsSync(resourcePath) && fs.existsSync(path.join(resourcePath, 'metadata.json'))) {
                    console.log('inside exist path =====> 3');
                    resolve(true);
                } else {
                    console.log('inside else faield exist ========');
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    });
}
export default isBackendProjectExist;
