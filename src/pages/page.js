// const React = require('react')
// const ReactDOM = require('react-dom')
// const Footer = require('../components/footer.js')
// const NavBar = require('../components/navbar.js')
// const Contentbox = require('../components/contentbox')
// // const darkBaseTheme = require('material-ui/styles/baseThemes/darkBaseTheme')
// // const MuiThemeProvider = require ('material-ui/styles/MuiThemeProvider')
// // const getMuiTheme = require('material-ui/styles/getMuiTheme')
import React from 'react';
import  NavBar  from '../components/Navbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import it from 'react-intl/locale-data/it';
import { observer } from "mobx-react";
import AutographaStore from "../components/AutographaStore";
import dbUtil from '../util/DbUtil';
const i18n = new(require('../translations/i18n'))();
const refDb = require("../util/data-provider").referenceDb();
addLocaleData([...en, ...es, ...fr, ...it]);
// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
// Try full locale, try locale without region code, fallback to 'en'
// const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

@observer
class Page extends React.Component {

	constructor(props){
		super(props);
	    this.state = {appLang: '', dbsetup: false}
	    i18n.getLocale().then((lang) => {
			AutographaStore.appLang = lang;
	    });
	    i18n.currentLocale().then((res) => {
			AutographaStore.currentTrans = res;
        })
        

    }
    componentDidMount() {
        dbUtil.dbSetupAll().then((res) => {
            this.setState({dbsetup: res})
        }).catch((err) => {
            this.setState({dbsetup: false})

        })
    }
    
	componentWillMount(){
		refDb.get('activeRefs').then((doc) => {
            Object.assign(AutographaStore.activeRefs, doc.activeRefs)
        }, (err) => {
        	console.log(err)
        });
	}   
	

	render(){
		if(Object.keys(AutographaStore.currentTrans).length === 0){
			return (<div></div>)
        }
        if(this.state.dbsetup === false) {
            return(<div></div>)
        }
        
	    return (
	    	<IntlProvider locale = 'en' key = {AutographaStore.appLang} messages = {AutographaStore.currentTrans} >
			    <MuiThemeProvider>
			    	<NavBar /> 
			    </MuiThemeProvider>
	     	</IntlProvider>
	    )
	} 
};

module.exports = Page

