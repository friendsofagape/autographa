const htmlMap = (context) => ({
  '*': {
    '*': {
      tagName: 'span',
    },
    sequence: {
      tagName: 'section',
    },
  },
  wrapper: {
    '*': {
      tagName: 'wrapper',
    },
    sequence: {
      tagName: 'section',
    },
  },
  paragraph: {
    '*': {
      tagName: 'p',
    },
  },
  mark: {
    '*': {
      tagName: 'span',
    },
    chapter: ({ atts }) => {
      context.lastChapter = atts.number;
      return ({
        classList: ['mark', 'chapter', `chapter-${atts.number}`],
        id: `ch-${atts.number}`,
        tagName: 'span',
      });
    },
    verses: ({ atts }) => ({
      classList: ['mark', 'verse', `verse-${atts.number}`],
      id: `ch${context.lastChapter}v${atts.number}`,
      tagName: 'a',
    }),
  },
  graft: {
    heading: {
      tagName: 'div',
    },
    title: {
      tagName: 'div',
    },
    introduction: {
      tagName: 'div',
    },
  },
});

export default htmlMap({});
