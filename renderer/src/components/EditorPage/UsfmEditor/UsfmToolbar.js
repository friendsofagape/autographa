export const UsfmToolbar = {
    'Section Header': {
        icon: '\\s',
        cssClass: 's-toolbar-button',
        actionSpec: {
            buttonType: 'ParagraphButton',
            usfmMarker: 's',
            additionalAction: () => console.log('Section header button pressed!'),
        },
    },
    'Quoted Book Title': {
        icon: '\\bk',
        cssClass: 'bk-toolbar-button',
        actionSpec: {
            buttonType: 'MarkButton',
            usfmMarker: 'bk',
        },
    },
    'Nomen Domini': {
        icon: '\\nd',
        cssClass: 'nd-toolbar-button',
        actionSpec: {
            buttonType: 'MarkButton',
            usfmMarker: 'nd',
        },
    },
};
