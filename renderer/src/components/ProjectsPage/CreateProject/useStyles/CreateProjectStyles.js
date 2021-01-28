import { makeStyles } from '@material-ui/core/styles';

export const CreateProjectStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  radioroot: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  radiogroup: {
    marginLeft: 12,
  },
  direction: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  textfieldsmall: {
    marginLeft: theme.spacing(1),
    margin: theme.spacing(0.5),
    width: theme.spacing(30),
  },
  version: {
    marginLeft: theme.spacing(13),
  },
  autocomplete: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(30),
  },
  biblename: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(30),
    marginTop: theme.spacing(1),
  },
  licenseselect: {
    marginLeft: theme.spacing(0.5),
    width: theme.spacing(30),
    marginTop: theme.spacing(1),
  },
  license: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(30),
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    border: 'ridge',
    borderRadius: 5,
  },
  Specification: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(33),
    marginBottom: theme.spacing(4),
  },
  rootcolor: {
    backgroundColor: '#EAEEF1',
  },
  selected: {
    borderColor: 'turquoise !important',
    border: 'ridge',
    borderRadius: 5,
    fontWeight: 600,
  },
  listtext: {
    fontWeight: 600,
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow:
      'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
}));
