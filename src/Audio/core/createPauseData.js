import ConcatAudio from './ConcatAudio';
let audio = new ConcatAudio();
const { app } = require('electron').remote;
const fs = require('fs');
const path = require('path');


const createPauseData = async(file, book, chapter, currentVerse, rectime) => {
	rectime = rectime.sort((a, b) => a.verse - b.verse);
		var recordedJSON = { ...rectime }
		var newfilepath = path.join(app.getPath('userData'), 'recordings', book.bookName, chapter, `output.json`)
    if (fs.existsSync(path.join(app.getPath('userData'), 'recordings',book.bookName, chapter))){
        var filePath = path.join(app.getPath('userData'), 'recordings', book.bookName, chapter, `temp.mp3`)
		if (fs.existsSync(path.join(app.getPath('userData'), 'recordings',book.bookName, chapter))){
			filePath = await writeRecfile(file, filePath);
			fs.writeFile( newfilepath , JSON.stringify(recordedJSON), 'utf8', function (err) {
				if (err) {
					console.log("An error occured while writing JSON Object to File.");
					return console.log(err);
				}
			});
        }
	}
	return Promise.all(filePath);
}

    function writeRecfile(file, filePath) {
        var fileReader = new FileReader();
        fileReader.onload = function() {
            fs.writeFileSync(filePath, Buffer.from(new Uint8Array(this.result)));
        };
        fileReader.readAsArrayBuffer(file.blob);
        return filePath;
    }
export default createPauseData;
