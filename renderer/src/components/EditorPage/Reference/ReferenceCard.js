/* eslint-disable react/prop-types */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import Button from '@material-ui/core/Button';
import {
    CardContent,
  } from 'translation-helps-rcl';
import { theme } from '@/components/main';
import TranslationhelpsNav from './TranslationhelpsNav';

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
const ReferenceCard = ({
    title,
    items,
    item,
    filters,
    itemIndex,
    markdownView,
    setItemIndex,
    markdown,
    languageId,
    selectedQuote,
    setQuote,
    viewMode,
}) => {
    const classes = useStyles();
    return (
      <>
        <ThemeProvider theme={theme}>
          <Container>
            <Card className={classes.root}>
              <div>
                <TranslationhelpsNav
                  items={items}
                  classes={classes}
                  itemIndex={itemIndex}
                  setItemIndex={setItemIndex}
                />
              </div>
              <div className={classes.title} color="textSecondary" gutterBottom>
                {title}
              </div>
              <Typography className={classes.body} variant="body2" component="p">
                <CardContent
                  item={item}
                  items={items}
                  filters={filters}
                  markdown={markdown}
                  languageId={languageId}
                  markdownView={markdownView}
                  selectedQuote={selectedQuote}
                  setQuote={setQuote}
                  viewMode={viewMode}
                />
              </Typography>
            </Card>
          </Container>
        </ThemeProvider>
      </>
      );
};

export default ReferenceCard;
