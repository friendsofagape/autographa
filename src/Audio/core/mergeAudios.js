import ConcatAudio from "./ConcatAudio";
import swal from "sweetalert";
import AutographaStore from "../../components/AutographaStore";
const remote = window.remote;
const app = remote.app;
const fs = window.fs;
const path = require("path");
let audio = new ConcatAudio();
const db = require(`${__dirname}/../../core/data-provider`).targetDb();

const mergeAudios = async (book, chapter, versenum) => {
  var merged, output;
  let doc = await db.get("targetBible");
  let filepath = doc.targetPath;
  let outputmetaData = [];
  if (
    fs.existsSync(
      path.join(app.getPath("userData"), "recordings", book.bookName, chapter)
    )
  ) {
    // fileReader.readAsArrayBuffer()
    let audiomp3 = [];
    versenum = versenum.sort((a, b) => a - b);
    versenum.forEach(function (verse, i) {
      let audioImport;
      audioImport = path.join(
        app.getPath("userData"),
        "recordings",
        book.bookName,
        chapter,
        `verse${verse}.mp3`
      );
      audiomp3.push(audioImport);
    });
    audio
      .fetchAudio(...audiomp3)
      .then((buffers) => {
        // => [AudioBuffer, AudioBuffer]
        merged = audio.concatAudio(buffers);
        console.log("buff", merged);
      })
      .then(() => {
        // => AudioBuffer
        console.log("merged", merged);
        output = audio.export(merged, "audio/mp3");
      })
      .then(() => {
        console.log("out", output);

        if (
          fs.existsSync(
            path.join(
              filepath[0],
              "recordings",
              book.bookName,
              `${chapter}.mp3`
            )
          )
        ) {
          writeRecfile(
            output.blob,
            path.join(
              filepath[0],
              "recordings",
              book.bookName,
              `${chapter}.mp3`
            )
          );
        } else {
          if (!fs.existsSync(path.join(filepath[0], "recordings"))) {
            fs.mkdirSync(path.join(filepath[0], "recordings"));
          }
          if (
            fs.existsSync(path.join(filepath[0], "recordings", book.bookName))
          ) {
            writeRecfile(
              output.blob,
              path.join(
                filepath[0],
                "recordings",
                book.bookName,
                `${chapter}.mp3`
              )
            );
          } else {
            fs.mkdirSync(path.join(filepath[0], "recordings", book.bookName));
            writeRecfile(
              output.blob,
              path.join(
                filepath[0],
                "recordings",
                book.bookName,
                `${chapter}.mp3`
              )
            );
          }
        }
        // => {blob, element, url}
        // audio.download(
        // 	output.blob,
        // 	`${book.bookName}/${chapter}`,
        // );
        // console.log(output.element)
        // document.body.append(output.element);
      })
      .then(() => {
        if (AutographaStore.ChapterComplete === true) {
          var newfilepath = path.join(
            app.getPath("userData"),
            "recordings",
            book.bookName,
            chapter,
            `output.json`
          );
          let outputTxtfile = path.join(
            filepath[0],
            "recordings",
            book.bookName,
            `${chapter}_timing.tsv`
          );
          if (fs.existsSync(newfilepath)) {
            fs.readFile(
              newfilepath,
              // callback function that is called when reading file is done
              function (err, data) {
                // json data
                var jsonData = data;
                // parse json
                var jsonParsed = JSON.parse(jsonData);
                // access elements
                var prevendtime;
                for (var key in jsonParsed) {
                  if (jsonParsed.hasOwnProperty(key)) {
                    var val = jsonParsed[key];
                    let starttime;
                    let endtime;
                    if (val.verse === 1) {
                      starttime = 0;
                    } else {
                      starttime = prevendtime;
                    }
                    endtime = starttime + val.totaltime;
                    prevendtime = endtime + 1;
                    let eachSegment = [starttime, endtime, val.verse];
                    outputmetaData.push(eachSegment);
                  }
                }
                require("fs").writeFile(
                  outputTxtfile,
                  outputmetaData
                    .map(function (v) {
                      return v.join("\t ");
                    })
                    .join("\n"),
                  function (err) {
                    console.log(
                      err ? "Error :" + err : `Created ${chapter}.txt`
                    );
                  }
                );
              }
            );
          }
        }
      })
      .catch((error) => {
        // => Error Message
        console.log("error", error);
      })
      .finally(() => {
        const currentTrans = AutographaStore.currentTrans;
        let filePath = path.join(filepath[0], "recordings", book.bookName);
        AutographaStore.isAudioSave = true;
        swal({
          title: currentTrans["dynamic-msg-export-recording"],
          text: `${currentTrans["label-folder-location"]} : ${filePath}`,
          icon: "success",
        });
      });
    audio.notSupported(() => {
      console.log("Handle no browser support");
      // Handle no browser support
    });
  }
};

// function ConcatenateBlobs(blobs, type, callback) {
//     var buffers = [];
//     var index = 0;
//     var filePath = path.join(app.getPath('userData'), 'recordings', 'Exodus', "Chapter1", `combined.mp3`)

//     async function readAsArrayBuffer() {
//         if (!blobs[index]) {
//             writeRecfile( await concatenateBuffers(), filePath)
//             return concatenateBuffers();
//         }
//         var reader = new FileReader();
//         reader.onload = function(event) {
//             buffers.push(event.target.result);
//             index++;
//             readAsArrayBuffer();
//         };
//         reader.readAsArrayBuffer(blobs[index]);
//     }

//     readAsArrayBuffer();

//     function concatenateBuffers() {
//         var byteLength = 0;
//         buffers.forEach(function(buffer) {
//             byteLength += buffer.byteLength;
//         });

//         var tmp = new Uint16Array(byteLength);
//         var lastOffset = 0;
//         buffers.forEach(function(buffer) {
//             // BYTES_PER_ELEMENT == 2 for Uint16Array
//             var reusableByteLength = buffer.byteLength;
//             if (reusableByteLength % 2 != 0) {
//                 buffer = buffer.slice(0, reusableByteLength - 1)
//             }
//             tmp.set(new Uint16Array(buffer), lastOffset);
//             lastOffset += reusableByteLength;
//         });

//         var blob = new Blob([tmp.buffer], {
//             type: type
//         });
//         return blob
//     }
// };

function writeRecfile(file, filePath) {
  var fileReader = new FileReader();
  fileReader.onload = function () {
    fs.writeFileSync(filePath, Buffer.from(new Uint8Array(this.result)));
  };
  fileReader.readAsArrayBuffer(file);
  return filePath;
}
export default mergeAudios;
