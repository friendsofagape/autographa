import React from 'react';
import Home from '../src/components/Home';
import Meta from '../src/Meta';
import AuthenticationContextProvider from '../src/components/Login/AuthenticationContextProvider';

export default function index() {
	return (
		<div>
			<Meta />
			<AuthenticationContextProvider>
				<Home />
			</AuthenticationContextProvider>
		</div>
	);
}
