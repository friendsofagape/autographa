import AutographaStore from '../components/AutographaStore';
const path = require('path');
const fs = require('fs');
const constants = require('./constants');
const db = require(`${__dirname}/./data-provider`).targetDb();

export const initializeBackUp = async () => {
	try {
		// Initial Backup call
		backUp();
		const delay = 60000 * 60; // 60 minutes/1 hour
		setInterval(async () => {
			backUp();
		}, delay);
	} catch (e) {
		console.log(e);
	}
};

async function backUp() {
  let targetLangDoc = await db.get('targetBible');
  if (
    targetLangDoc.backupFrequency.toLowerCase() === 'none' ||
    targetLangDoc.backupFrequency.toLowerCase() === ''
  ) {
    return;
  }
	const outputPath = targetLangDoc.targetPath;
	const directory = path.join(
		Array.isArray(outputPath) ? outputPath[0] : outputPath,
		'auto-backup',
	);
	const nameElements = [
		targetLangDoc && targetLangDoc.targetLang,
		targetLangDoc && targetLangDoc.targetVersion,
	].filter(Boolean);
	const foldername = nameElements.join('_');
	const dirPath = path.join(directory, foldername);
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
	await fs.readdir(dirPath, (err, folders) => {
		if (folders.length >= 1) {
			let folderName = folders[folders.length - 1].split('_');
			var d = new Date();
			let timeStamp = [d && getTimeStamp(d)].filter(Boolean);
			let currentTime = timeStamp[0].split('_');
			let days = calculateDays(currentTime, folderName);

			if (
				days >= 1 &&
				targetLangDoc.backupFrequency.toLowerCase() === 'daily'
			) {
				buildFilePath(new Date(), dirPath);
				folderHandling(folders, dirPath);
			} else if (
				days >= 7 &&
				targetLangDoc.backupFrequency.toLowerCase() === 'weekly'
			) {
				buildFilePath(new Date(), dirPath);
				folderHandling(folders, dirPath);
			} else {
				return null;
			}
		} else {
				buildFilePath(new Date(), dirPath);
		}
	});
}

async function exportAllBooks(dir) {
	let doc = await db.get('targetBible');
	constants.bookCodeList.forEach(async (value, index) => {
		let book = {};
		book.bookNumber = (index + 1).toString();
		book.bookName = AutographaStore.editBookNamesMode
			? AutographaStore.translatedBookNames[index]
			: constants.booksList[index];
		book.bookCode = value;
		book.outputPath = doc.targetPath;
		await toUsfm(book, dir);
	});
}

export const toUsfm = async (book, dir) => {
	const usfmDoc = await toUsfmDoc(book, false);
	const filename = book.bookCode + '.usfm';
	const filePath = path.join(dir, filename);
	writeUsfm(usfmDoc, filePath);
};

async function toUsfmDoc(book, returnNullForEmptyBook = false) {
	try {
		const usfmContent = [];
		var isEmpty = true;
		usfmContent.push('\\id ' + book.bookCode);
		usfmContent.push('\\mt ' + book.bookName);
		const doc = await db.get(book.bookNumber);
		for (const chapter of doc.chapters) {
			usfmContent.push('\n\\c ' + chapter.chapter);
			usfmContent.push('\\p');
			let i = 0;
			let verseNumber;
			let verses;
			for (const verse of chapter.verses) {
				i = i + 1;
				if (
					i < chapter.verses.length &&
					chapter.verses[i].joint_verse
				) {
					// Finding out the join verses and get their verse number(s)
					verseNumber =
						chapter.verses[i].joint_verse +
						'-' +
						chapter.verses[i].verse_number;
					verses =
						chapter.verses[chapter.verses[i].joint_verse - 1].verse;
					continue;
				} else {
					if (verseNumber) {
						// Push join verse number (1-3) and content.
						let newVerse = addMtag(verses);
						usfmContent.push('\\v ' + verseNumber + ' ' + newVerse);
						verseNumber = undefined;
						verses = undefined;
					} else {
						// Push verse number and content.
						let newVerse = addMtag(verse.verse);
						usfmContent.push(
							'\\v ' + verse.verse_number + ' ' + newVerse,
						);
					}
					isEmpty = isEmpty && !verse.verse;
				}
			}
		}
		return returnNullForEmptyBook && isEmpty
			? null
			: usfmContent.join('\n');
	} catch (err) {
		console.log(err);
	}
}

function addMtag(verses) {
	let newVerse = verses;
	if (verses.indexOf('\n') !== -1) {
		newVerse = verses.trim().replace(new RegExp(/[\n\r]/, 'gu'), '\n\\m ');
		verses = newVerse;
	}
	return newVerse;
}

async function buildFilePath(date, dirPath) {
	const dateElement = [date && getTimeStamp(date)].filter(Boolean);
	const dir = path.join(dirPath, dateElement[0]);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	exportAllBooks(dir);
}

function folderHandling(folders, dirPath) {
	if (folders.length >= 5) {
		var files = fs.readdirSync(path.join(dirPath, folders[0]));
		files.forEach((file) => {
			fs.unlinkSync(path.join(dirPath, folders[0], file));
		});
		fs.rmdir(path.join(dirPath, folders[0]), function (err, result) {
			if (err) console.log('error', err);
		});
	}
}

function writeUsfm(usfmDoc, filePath) {
	if (usfmDoc && filePath) {
		fs.writeFileSync(filePath, usfmDoc, 'utf8', function (err, result) {
			if (err) console.log('error', err);
		});
	}
}

function getTimeStamp(date) {
	var months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	var year = date.getFullYear(),
		month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1),
		day = (date.getDate() < 10 ? '0' : '') + date.getDate(),
		hour = (date.getHours() < 10 ? '0' : '') + date.getHours(),
		minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
		second = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

	return (
		months[parseInt(month) - 1] +
		' ' +
		day +
		'-' +
		year.toString() +
		'_' +
		hour +
		'' +
		minute +
		'' +
		second
	).toString();
}

function calculateDays(currDate, preDate) {
	var currTime = new Date(
		currDate[0] +
			' ' +
			currDate[1].toString().replace(/\B(?=(\d{2})+(?!\d))/g, ':'),
	);
	var preTime = new Date(
		preDate[0] +
			' ' +
			preDate[1].toString().replace(/\B(?=(\d{2})+(?!\d))/g, ':'),
	);
	var difference = Math.abs(currTime.getTime() - preTime.getTime()) / 1000;
	// var hour = Math.floor(difference / 3600) % 24;
	// var minutes = Math.floor(difference / 60) % 60;
	var days = Math.floor(difference / 86400);
	return days;
}
