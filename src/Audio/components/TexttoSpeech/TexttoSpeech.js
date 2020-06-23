// import React, { useContext, useState, useEffect, useRef } from 'react';
// import Speech from 'speak-tts';
// import { StoreContext } from '../../context/StoreContext';
// import * as sampleBible1 from '../VerseGrid/verse';
// import { makeStyles } from '@material-ui/core/styles';
// import PlayArrowIcon from '@material-ui/icons/PlayArrow';
// import PauseIcon from '@material-ui/icons/Pause';
// import ReplayIcon from '@material-ui/icons/Replay';
// import StopIcon from '@material-ui/icons/Stop';
// import { IconButton, Fab } from '@material-ui/core';
// import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
// import SkipNextIcon from '@material-ui/icons/SkipNext';

// const sampleBible = sampleBible1.default;
// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		flexGrow: 1,
// 	},
// 	fab: {
// 		zIndex: 1,
// 		left: 0,
// 		right: 0,
// 		margin: theme.spacing(2),
// 		marginLeft: -7,
// 		width: 40,
// 		height: 40,
// 	},
// }));

// export default function TexttoSpeech(props) {
// 	const classes = useStyles();
// 	const { onselect } = useContext(StoreContext);
// 	const { selectNext } = useContext(StoreContext);
// 	const { selectPrev } = useContext(StoreContext);
// 	const [verseselected, setVerseselected] = useState(null);
// 	const [onPlaying, setOnplaying] = useState(false);
// 	const [onresume, setOnresume] = useState(false);
// 	const [versechanged, setVersechanged] = useState(false);

// 	useEffect(() => {
// 		if(props.currentRefverse!==undefined){
// 			setVerseselected(props.currentRefverse)
// 		}
// 	});

// 	const speech = new Speech(); // will throw an exception if not browser supported
// 	if (speech.browserSupport) {
// 		// returns a boolean
// 		console.log('speech synthesis supported');
// 	}
// 	speech
// 		.init({
// 			volume: 1,
// 			lang: 'en-GB',
// 			rate: 0.9,
// 			pitch: 1,
// 			'voice':'Google UK English Male',
// 			// // 'splitSentences': false,
// 			// listeners: {
// 			// 	onvoiceschanged: (voices) => {
// 			// 		console.log('Voices changed', voices);
// 			// 	},
// 			// },
// 		})
// 		.then((data) => {
// 			// console.log('Speech is ready', data);
// 		})
// 		.catch((e) => {
// 			console.log(speechSynthesis)
// 			console.error('An error occured while initializing : ', e);
// 		});

// 	const ref = useRef();
// 	useEffect(() => {
// 		ref.current = onselect;
// 	});
// 	const prevVal = ref.current;
// 	useEffect(() => {
// 		if (prevVal !== onselect) {
// 			speech.pause();
// 			setOnplaying(false);
// 			setVersechanged(true);
// 			setOnresume(false);
// 		} else {
// 			setVersechanged(false);
// 		}
// 	});

// 	function onPlay() {
// 		console.log(verseselected)
// 		speech.setLanguage('hi-IN');
// 		speech.setVoice('Google हिन्दी');
// 		speech
// 			.speak({
// 				text: verseselected,
// 				queue: false,
// 				listeners: {
// 					onstart: () => {
// 						console.log('Start utterance');
// 						setOnplaying(true);
// 					},
// 					onend: () => {
// 						console.log('End utterance');
// 					},
// 					onresume: () => {
// 						console.log('Resume utterance');
// 					},
// 					onboundary: (event) => {
// 						console.log(
// 							event.name +
// 								' boundary reached after ' +
// 								event.elapsedTime +
// 								' milliseconds.',
// 						);
// 					},
// 				},
// 			})
// 			.then((data) => {
// 				console.log('Success !', data);
// 				setOnplaying(false);
// 				setOnresume(false);
// 			})
// 			.catch((e) => {
// 				console.error('An error occurred :', e);
// 			});
// 	}
// 	function onPause() {
// 		speech.pause();
// 		if (onPlaying && versechanged === false) setOnresume(true);
// 		else setOnresume(false);
// 	}
// 	function onResume() {
// 		speech.resume();
// 		setOnresume(false);
// 	}
// 	return (
// 		<div>
// 			<div>
// 				{onPlaying === false && (
// 					<Fab
// 						id='play'
// 						className={classes.fab}
// 						primary
// 						name='play'
// 						onClick={onPlay}>
// 						<PlayArrowIcon />
// 					</Fab>
// 				)}
// 				{onPlaying === true && (
// 					<Fab
// 						id='replay'
// 						className={classes.fab}
// 						name='replay'
// 						onClick={onPlay}>
// 						<ReplayIcon />
// 					</Fab>
// 				)}
// 				{onresume === false && (
// 					<Fab
// 						id='play'
// 						className={classes.fab}
// 						name='play'
// 						onClick={onPause}>
// 						<PauseIcon />
// 					</Fab>
// 				)}
// 				{onresume === true && (
// 					<Fab
// 						id='resume'
// 						className={classes.fab}
// 						name='resume'
// 						onClick={onResume}>
// 						<PlayArrowIcon />
// 					</Fab>
// 				)}
// 				<Fab
// 					color='primary'
// 					aria-label='edit'
// 					className={classes.fab}
// 					onClick={selectPrev}>
// 					<SkipPreviousIcon />
// 				</Fab>
// 				<Fab
// 					color='primary'
// 					aria-label='edit'
// 					className={classes.fab}
// 					onClick={selectNext}>
// 					<SkipNextIcon />
// 				</Fab>
// 			</div>
// 		</div>
// 	);
// }
