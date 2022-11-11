import localForage from 'localforage';
import moment from 'moment';
import * as logger from '../../../../logger';

const JSZip = require('jszip');

const DownloadCreateSBforHelps = async (projectResource, setLoading, update = false, offlineResource = false) => {
    try {
        // console.log('download/update started --------', { projectResource, update, offlineResource });
        logger.debug('DownloadCreateSBforHelps.js', 'Download Started');
        setLoading(true);
        await localForage.getItem('userProfile').then(async (user) => {
            logger.debug('DownloadCreateSBforHelps.js', 'In helps-resource download user fetch - ', user?.username);
            const fs = window.require('fs');
            const path = require('path');
            const newpath = localStorage.getItem('userPath');
            const folder = path.join(newpath, 'autographa', 'users', `${user?.username}`, 'resources');
            // const currentUser = user?.username;
            // const key = currentUser + projectResource.name + projectResource.owner + moment().format();
            // const id = uuidv5(key, environment.uuidToken);
            // check for existing resources
            const existingResource = fs.readdirSync(folder, { withFileTypes: true });
            const downloadProjectName = `${projectResource?.name}_${projectResource?.owner}_${projectResource?.release?.tag_name}`;
            existingResource?.forEach((element) => {
                if (downloadProjectName === element.name) {
                    throw new Error('Resource Already Exist');
                }
            });

            // check if resource already exist in offline
            if (!update && offlineResource) {
                // eslint-disable-next-line array-callback-return
                const resourceExist = offlineResource.filter((offline) => {
                    if (offline?.projectDir === `${projectResource?.name}_${projectResource?.owner}_${projectResource?.release?.tag_name}`) {
                        return offline;
                    }
                });
                if (resourceExist.length > 0) {
                    throw new Error('Resource Already Exist');
                    // eslint-disable-next-line no-throw-literal
                    // throw 'Resource Already Exist';
                }
            }

            // eslint-disable-next-line no-async-promise-executor
            // return new Promise(async (resolve) => {
                // const json = {};
                // download and unzip the content
                await fetch(projectResource?.zipball_url)
                    .then((res) => res.arrayBuffer())
                    .then(async (blob) => {
                        logger.debug('DownloadCreateSBforHelps.js', 'In resource download - downloading zip content ');
                        if (!fs.existsSync(folder)) {
                            fs.mkdirSync(folder, { recursive: true });
                        }
                        // wririntg zip to local
                        await fs.writeFileSync(path.join(folder, `${projectResource?.name}.zip`), Buffer.from(blob));
                        logger.debug('DownloadCreateSBforHelps.js', 'In resource download - downloading zip content completed ');

                        // extract zip
                        logger.debug('DownloadCreateSBforHelps.js', 'In resource download - Unzip downloaded resource');
                        const filecontent = await fs.readFileSync(path.join(folder, `${projectResource?.name}.zip`));
                        const result = await JSZip.loadAsync(filecontent);
                        const keys = Object.keys(result.files);

                        // eslint-disable-next-line no-restricted-syntax
                        for (const key of keys) {
                            const item = result.files[key];
                            if (item.dir) {
                                fs.mkdirSync(path.join(folder, item.name), { recursive: true });
                            } else {
                                // eslint-disable-next-line no-await-in-loop
                                const bufferContent = Buffer.from(await item.async('arraybuffer'));
                                fs.writeFileSync(path.join(folder, item.name), bufferContent);
                            }
                        }
                        // let resourceMeta = {};
                        await fetch(projectResource.metadata_json_url)
                            .then((res) => res.json())
                            .then(async (data) => {
                                // console.log('json data : ', data);
                                // adding offline true tag in  meta for identification
                                data.agOffline = true;
                                data.meta = projectResource;
                                data.lastUpdatedAg = moment().format();
                                // console.log('json data after : ', data);
                                await fs.writeFileSync(path.join(folder, projectResource?.name, 'metadata.json'), JSON.stringify(data));
                            }).catch((err) => {
                                // console.log('failed to save yml metadata.json : ', err);
                                logger.debug('DownloadCreateSBforHelps.js', 'failed to save yml metadata.json : ', err);
                            });

                        // finally remove zip and rename base folder to projectname_id
                        logger.debug('DownloadCreateSBforHelps.js', 'deleting zip file - rename project with project + id in ag format');
                        if (fs.existsSync(folder)) {
                            fs.renameSync(path.join(folder, projectResource?.name), path.join(folder, `${projectResource?.name}_${projectResource?.owner}_${projectResource?.release?.tag_name}`));
                            fs.unlinkSync(path.join(folder, `${projectResource?.name}.zip`), (err) => {
                                if (err) {
                                logger.debug('DownloadCreateSBforHelps.js', 'error in deleting zip');
                                // console.log(`Removing Resource Zip Failed :  ${projectResource?.name}.zip`);
                                throw new Error(`Removing Resource Zip Failed :  ${projectResource?.name}.zip`);
                                }
                            });
                            if (update && update?.status) {
                                // if updation delete old resource
                                // console.log({ projectOld: `${projectResource?.name}_${projectResource?.owner}_${update?.prevVersion}` });
                                  try {
                                    fs.rmSync(path.join(folder, `${projectResource?.name}_${projectResource?.owner}_${update?.prevVersion}`), { recursive: true });
                                    update && update?.setIsOpen(false);
                                  } catch (err) {
                                    logger.debug('DownloadCreateSBforHelps.js', 'error in deleting prev resource');
                                      setLoading(false);
                                      throw new Error(`Removing Previous Resource Failed :  ${projectResource?.name}_${projectResource?.owner}_${update?.prevVersion}`);
                                  }
                            }
                        }
                    });
                logger.debug('DownloadCreateSBforHelps.js', 'download completed');
                // console.log('download finished --------');
                setLoading(false);
                // resolve(json);
            });
        // });
    } catch (err) {
        setLoading(false);
        throw err;
    }
};

export default DownloadCreateSBforHelps;
