import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import AutographaStore from '../../../components/AutographaStore';
const formattedSeconds = (sec) =>
	Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2);

export default function Timer(props) {
	const { timer, setTimer, secondsElapsed } = useContext(StoreContext);

	useEffect(() => {
		let interval;
		if (timer)
			interval = setInterval(() => setTimer(secondsElapsed + 1), 1000);
		return () => clearInterval(interval);
	});

	return (
		<div>
			{props.open && (
				<div>
					<h1>{formattedSeconds(secondsElapsed)}</h1>
				</div>
			)}
		</div>
	);
}
