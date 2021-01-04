import * as localForage from 'localforage';
import React from 'react';
function useAuthentication(user) {
	const [accessToken, setaccessToken] = React.useState();
	const getToken = () => {
		localForage.getItem('sessionToken').then((value) => {
			console.log('value', value);
			setaccessToken(value);
		});
	};
	const setToken = (user) => {
		console.log('getToken', user);
		const token = user.access_token;
		console.log(token);
		if (token) {
			localForage.setItem('sessionToken', token);
			localForage.setItem('loggedInUser', user);
			setaccessToken(token);
		}
	};
	const logout = () => {
		setaccessToken();
		localForage.removeItem('sessionToken');
		localForage.removeItem('loggedInUser');
	};
	const response = {
		state: accessToken,
		actions: { getToken, setToken, logout },
	};
	return response;
}
export default useAuthentication;
