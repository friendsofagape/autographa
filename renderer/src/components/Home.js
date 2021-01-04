import React from 'react';
import Main from './main';
import Login from './Login/Login';
import { AuthenticationContext } from './Login/AuthenticationContextProvider';
import { handleUser } from '../core/handleJson';
const Home = () => {
	const { states, action } = React.useContext(AuthenticationContext);
	console.log('index', states);

	React.useEffect(() => {
		const fs = window.require('fs');
		handleUser(fs);
	}, []);
	React.useEffect(() => {
		if (!states) {
			action.getToken();
		}
	}, [states]);
	return <div>{states ? <Main /> : <Login />}</div>;
};
export default Home;
