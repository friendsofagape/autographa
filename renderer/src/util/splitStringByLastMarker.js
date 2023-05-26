// split any string into array items based on last occurance of something
// both inputs should be string

export async function splitStringByLastOccurance(text, splitter) {
    const lastOccuranceIndex = text.lastIndexOf(splitter);

    if (lastOccuranceIndex !== -1) {
      const prefix = text.substring(0, lastOccuranceIndex);
      const suffix = text.substring(lastOccuranceIndex + 1);
      return [prefix, suffix];
    }

    // No Occurance found
    return [text];
  }
