const { app } = require('electron').remote;
const fs = require('fs');
const path = require('path');
module.exports = {
	recSave: async function(book, file, chapter, versenum, recVerse, rectime) {
		rectime = rectime.sort((a, b) => a.verse - b.verse);
		recVerse = recVerse.sort((a,b) => a-b)
		var recordedJSON = { ...rectime }
		var filePath = path.join(app.getPath('userData'), 'recordings', book.bookName, chapter, `verse${versenum}.mp3`)
		var newfilepath = path.join(app.getPath('userData'), 'recordings', book.bookName, chapter, `output.json`)
		if (!fs.existsSync(path.join(app.getPath('userData'), 'recordings',book.bookName, chapter))){
			if (!fs.existsSync(path.join(app.getPath('userData'), 'recordings'))){
				fs.mkdirSync(path.join(app.getPath('userData'), 'recordings'));
			}
			if (!fs.existsSync(path.join(app.getPath('userData'), 'recordings', book.bookName))){
				fs.mkdirSync(path.join(app.getPath('userData'), 'recordings',book.bookName ));
			}
			if (!fs.existsSync(path.join(app.getPath('userData'), 'recordings', book.bookName, chapter))){
				fs.mkdirSync(path.join(app.getPath('userData'), 'recordings', book.bookName, chapter));
			}
			filePath = await writeRecfile(file, filePath);
			fs.writeFile( newfilepath , JSON.stringify(recordedJSON), 'utf8', function (err) {
				if (err) {
					console.log("An error occured while writing JSON Object to File.");
					return console.log(err);
				}
			});
		}
		else{
			fs.writeFile( newfilepath , JSON.stringify(recordedJSON), 'utf8', function (err) {
				if (err) {
					console.log("An error occured while writing JSON Object to File.");
					return console.log(err);
				}
			});
			
			filePath = await writeRecfile(file, filePath);
		}
		return filePath;
	},
};

function writeRecfile(file, filePath) {
	var fileReader = new FileReader();
	fileReader.onload = function() {
		fs.writeFileSync(filePath, Buffer.from(new Uint8Array(this.result)));
	};
	fileReader.readAsArrayBuffer(file.blob);
	return filePath;
}
