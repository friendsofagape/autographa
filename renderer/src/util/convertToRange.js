export const convertToRange = (array) => {
    const ranges = [];
    let startingVal;
    let endValue;
  for (let i = 0; i < array.length; i += 1) {
    startingVal = array[i];
    endValue = startingVal;
    while (array[i + 1] - array[i] === 1) {
      endValue = array[i + 1]; // increment the index if the numbers sequential
      i += 1;
    }
    ranges.push(
        startingVal === endValue
        ? `${startingVal}`
        : `${startingVal }-${ endValue}`,
    );
  }
  return ranges;
};
