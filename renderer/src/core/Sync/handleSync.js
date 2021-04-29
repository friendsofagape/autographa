export const isUSFM = (filename) => {
  const extension = filename.split('.');
  // eslint-disable-next-line no-constant-condition
  if (extension[1]?.toLowerCase() === ('usfm' || 'sfm')) {
    return true;
  }
    return false;
};
export const getId = (lines) => {
  let bookCode;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 5; i++) {
    if (lines[i]) {
      const splitLine = lines[i].split(/ +/);
      if (splitLine[0] === '\\id') {
        // eslint-disable-next-line prefer-destructuring
        bookCode = splitLine[1];
        break;
      }
    }
  }
  return bookCode;
};
