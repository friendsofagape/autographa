// import moment from 'moment';
// import { v5 as uuidv5 } from 'uuid';
import localForage from 'localforage';
// import Textburrito from '../../../../lib/BurritoTemplete.json';
// import languageCode from '../../../../lib/LanguageCode.json';
import * as logger from '../../../../logger';
// import { environment } from '../../../../../environment';
// import packageInfo from '../../../../../../package.json';

const fs = window.require('fs');
const JSZip = require('jszip');

// const findCode = (list, id) => {
//     logger.debug('createDownloadedResourceSB.js', 'In findCode for getting the language code');
//     let code = '';
//     list.forEach((obj) => {
//         if ((obj.name).toLowerCase() === id.toLowerCase()) {
//             code = obj.lang_code;
//         }
//     });
//     return code;
// };
const DownloadCreateSBforHelps = async (projectResource, setLoading, update = false) => {
    try {
        console.log('download/update started --------', { projectResource, setLoading });
        setLoading(true);
        localForage.getItem('userProfile').then(async (user) => {
            logger.debug('DownloadCreateSBforHelps.js', 'In helps-resource download user fetch - ', user?.username);
            const path = require('path');
            const newpath = localStorage.getItem('userPath');
            const folder = path.join(newpath, 'autographa', 'users', `${user?.username}`, 'resources');

            // const currentUser = user?.username;
            // const key = currentUser + projectResource.name + projectResource.owner + moment().format();
            // const id = uuidv5(key, environment.uuidToken);

            // eslint-disable-next-line no-async-promise-executor
            return new Promise(async (resolve) => {
                const json = {};
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
                                // console.log('json data after : ', data);
                                await fs.writeFileSync(path.join(folder, projectResource?.name, 'metadata.json'), JSON.stringify(data));

                                // // creating fake burrito to get ingredients list
                                // json = Textburrito;
                                // json.meta.generator.userName = currentUser;
                                // json.meta.generator.softwareName = 'Autographa';
                                // json.meta.generator.softwareVersion = packageInfo.version;
                                // json.meta.dateCreated = moment().format();
                                // json.idAuthorities = {
                                //     dcs: {
                                //         id: new URL(projectResource.url).hostname,
                                //         name: {
                                //             en: projectResource.owner,
                                //         },
                                //     },
                                // };
                                // json.identification.primary = {
                                //     ag: {
                                //         [id]: {
                                //             revision: '1',
                                //             timestamp: moment().format(),
                                //         },
                                //     },
                                // };
                                // json.identification.upstream = {
                                //     dcs: [{
                                //         [`${projectResource.owner}:${projectResource.name}`]: {
                                //             revision: projectResource.release.tag_name,
                                //             timestamp: projectResource.released,
                                //         },
                                //     },
                                //     ],
                                // };
                                // json.identification.name.en = projectResource.name;
                                // json.identification.abbreviation.en = '';
                                // const code = findCode(languageCode, resourceMeta?.dublin_core?.language?.title);
                                // if (code) {
                                //     json.languages[0].tag = code;
                                // } else {
                                //     json.languages[0].tag = resourceMeta?.dublin_core.language?.title.substring(0, 3);
                                // }
                                // json.languages[0].name.en = projectResource?.language_title;
                                // json.copyright.shortStatements = [
                                //     {
                                //         statement: resourceMeta?.dublin_core?.rights,
                                //     },
                                // ];
                                // json.copyright.licenses[0].ingredient = 'LICENSE.md';
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
                console.log('download finished --------');
                setLoading(false);
                resolve(json);
            });
        });
    } catch (err) {
        setLoading(false);
        throw new Error(`Generate Burrito Failed :  ${err}`);
    }
};

export default DownloadCreateSBforHelps;
