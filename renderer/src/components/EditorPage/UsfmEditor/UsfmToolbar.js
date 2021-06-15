export const UsfmToolbar = {
    'Section Header': {
        icon: 'S',
        cssClass: 's-toolbar-button',
        actionSpec: {
            buttonType: 'ParagraphButton',
            usfmMarker: 's',
        },
    },
    'Quoted Book Title': {
        icon: 'BK',
        cssClass: 'bk-toolbar-button',
        actionSpec: {
            buttonType: 'MarkButton',
            usfmMarker: 'bk',
        },
    },
    'Nomen Domini': {
        icon: 'I',
        cssClass: 'nd-toolbar-button',
        actionSpec: {
            buttonType: 'MarkButton',
            usfmMarker: 'nd',
        },
    },
};
