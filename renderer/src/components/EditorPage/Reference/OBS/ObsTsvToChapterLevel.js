// filter current chapter data from whole TSV JSON and generate array of notes of md content
// based on reference of tsv

export default async function ObsTsvToChapterLevelMd(tsvJSON, chapter) {
    return new Promise((resolve) => {
        const filteredData = tsvJSON.filter((data) => data.Reference.split(':')[0].toString() === chapter.toString());
    const chapterTsvData = [];
    const notesObj = {};
    filteredData.forEach((tsvObj) => {
        let mdstring = '';
        mdstring += `# ${ tsvObj.Quote }\n\n${ tsvObj.Note }\n`;
        if (tsvObj.Reference.split(':')[1] in notesObj) {
            notesObj[tsvObj.Reference.split(':')[1]].OccurrenceNote += mdstring;
        } else {
            notesObj[tsvObj.Reference.split(':')[1]] = { OccurrenceNote: mdstring };
        }
    });
    Object.values(notesObj).forEach((value) => {
        chapterTsvData.push(value);
    });
    if (chapterTsvData?.length > 0) {
        resolve(chapterTsvData);
    }
    });
  }
