import { makeStyles } from '@material-ui/core/styles';

export const useStyle = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    },
    mainPaper: {
    height: '100vh',
    width: '100vw',
    paddingLeft: '12%',
    },
    paper: {
    height: '100vh',
    width: '100%',
    },
    heading: {
    fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    },
    icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
    },
    details: {
    alignItems: 'center',
    },
    column: {
    flexBasis: '33.33%',
    },
    helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
    },
    link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
  },
}));
