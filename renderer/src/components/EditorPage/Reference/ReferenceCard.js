/* eslint-disable react/prop-types */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
// import {
//     CardContent,
//   } from 'translation-helps-rcl';
import { theme } from '@/components/main';
import EditorSection from '../EditorSection';

const useStyles = makeStyles({
    root: {
      minWidth: 500,
    },
    chevronIcon: {
        margin: '0px 12px',
        cursor: 'pointer',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      fontStyle: 'normal',
      alignItems: 'center',
      textAlign: 'center',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    body: {
        height: '361px',
        fontSize: '14px',
        lineHeight: '24px',
        textIndent: '10px',
        color: '#000000',
        overflowY: 'auto',
        margin: 0,
        padding: 0,
        listStyle: 'none',
        '&::-webkit-scrollbar': {
          width: '0.4em',
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          outline: '1px solid slategrey',
        },
    },
    pos: {
      marginBottom: 12,
    },
  });
const ReferenceCard = (
//   {
//     title,
//     items,
//     item,
//     filters,
//     markdownView,
//     markdown,
//     languageId,
//     selectedQuote,
//     setQuote,
//     viewMode,
// }
) => {
    const classes = useStyles();
    return (
      <>
        <ThemeProvider theme={theme}>
          <EditorSection
            className={classes.body}
            // header={title}
          >
            <Typography variant="body3" component="p">
              {/* <CardContent
                item={item}
                items={items}
                filters={filters}
                markdown={markdown}
                languageId={languageId}
                markdownView={markdownView}
                selectedQuote={selectedQuote}
                setQuote={setQuote}
                viewMode={viewMode}
              /> */}
            </Typography>
          </EditorSection>
        </ThemeProvider>
      </>
      );
};

export default ReferenceCard;
