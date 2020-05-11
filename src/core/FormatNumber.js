export const FormatNumber = (arr) => {
  let result = ""; // track start and end
  let end = arr[0];
  let start = arr[0];
  arr.map((res, i) => {
    if (arr[i + 1] === arr[i + 1 - 1] + 1) {
      end = arr[i + 1];
    } else {
      if (start === end) {
        result += start + (arr.length > i + 1 ? ", " : "");
      } else {
        result += start + "-" + end + (arr.length > i + 1 ? ", " : "");
      }
      start = arr[i + 1];
      end = arr[i + 1];
    }
  });
  if (start === end && start !== undefined && end !== undefined) {
    result += start;
  } else {
    if (start !== undefined && end !== undefined) {
      result += start + "-" + end;
    }
  }
  return result;
};
