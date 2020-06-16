import AutographaStore from "../components/AutographaStore";
import fs from "fs";
import path from "path";
import { promisify } from "util";
const readdir = promisify(fs.readdir);
const bibUtil_to_json = require(`${__dirname}/../core/usfm_to_json`);

export const getStuffAsync = (param) =>
  new Promise(function (resolve, reject) {
    console.log(param);
    bibUtil_to_json.toJson(param, (err, data) => {
      if (err !== null) reject(err);
      else {
        console.log(data);
        resolve(data);
      }
    });
  });

export const importTranslation = (importDir, langCode, langVersion) => {
  getNonDotFiles(importDir)
    .then((filePaths) =>
      filePaths.map((filePath) =>
        getStuffAsync({
          lang: langCode.toLowerCase(),
          version: langVersion.toLowerCase(),
          usfmFile: filePath,
          targetDb: "target",
          scriptDirection: AutographaStore.refScriptDirection,
        })
      )
    )
    .then((ps) => Promise.all(ps));
};

export const importTranslationFiles = (importFiles, langCode, langVersion) => {
  return Promise.all(
    filterFiles(importFiles).map((filePath) => {
      return getStuffAsync({
        lang: langCode.toLowerCase(),
        version: langVersion.toLowerCase(),
        usfmFile: filePath,
        targetDb: "target",
        scriptDirection: AutographaStore.refScriptDirection,
      })
        .then((res) => {
          if (res !== undefined) {
            AutographaStore.successFile.push(res);
            console.log(res);
          }
        })
        .catch((err) => {
          AutographaStore.errorFile.push(err);
          console.log(err);
        });
    })
  );
};

export const saveJsonToDb = (
  importDir,
  bibleName,
  refLangCodeValue,
  refVersion
) =>
  Promise.all(
    filterFiles(importDir).map((filePath) =>
      getStuffAsync({
        bibleName: bibleName,
        lang: refLangCodeValue.toLowerCase(),
        version: refVersion.toLowerCase(),
        usfmFile: filePath,
        targetDb: "refs",
        scriptDirection: AutographaStore.refScriptDirection,
      })
        .then((res) => {
          if (res !== undefined) AutographaStore.successFile.push(res);
        })
        .catch((err) => {
          AutographaStore.errorFile.push(err);
        })
    )
  ).then((ps) => Promise.all(ps));

fs.readFileAsync = function (filename, enc) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, enc, function (err, data) {
      if (err) reject(err);
      else {
        console.log(data);
        resolve(data);
      }
    });
  });
};

/* filter out nondot files from the directory and its return promise  */
const getNonDotFiles = (dir) =>
  readdir(dir)
    .then((files) => files.filter((f) => !f.startsWith(".")))
    .then((files) => files.map((relPath) => path.join(dir, relPath)))
    .then((files) => files.filter((f) => fs.statSync(f).isFile()));

/* filter out nondot files from list of files */
const filterFiles = (files) => {
  files = files.filter((f) => !f.startsWith("."));
  return files.filter((f) => fs.statSync(f).isFile());
};
