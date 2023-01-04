import React, { useEffect, useState } from 'react';
// import { SquaresPlusIcon, CogIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SpeechRecognition({ trigger }) {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    const sr = new Speech();

    sr.continuous = true;
    sr.interimResults = true;
    sr.lang = 'en-IN';

    const [islistening, setIslistening] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [suggestion, setSuggestion] = useState(null);
    const [speechMode, setSpeechMode] = useState(false);

//     console.log({
//  speechMode, trigger, islistening, isPaused,
// });

    // function handleSpeechActions(trigger) {
    //     console.log('in handleSpeechAction ------------');
    //     switch (trigger) {
    //         case 'record':
    //             setIslistening(true);
    //             break;
    //         case 'recPause':
    //             setIsPaused(true);
    //             break;
    //             case 'recResume':
    //             setIsPaused(false);
    //             break;
    //         case 'recStop':
    //             setIslistening(false);
    //             setIsPaused(false);
    //         break;

    //         default:
    //             break;
    //     }
    // }

    function handleListen() {
        console.log('inside handle listen *******', { sr });
        if (islistening) {
            sr.start();
            sr.onend = () => {
                console.log('continue listening ...');
                sr.start();
            };
        } else {
            sr.stop();
            sr.onend = () => {
                console.log('stopped record mic off');
            };
        }
        sr.onstart = () => {
            console.log('mic on');
        };

        sr.onresult = (e) => {
            console.log('on result &&&&&&&&&&&&&&&&&&&&&&&&&&');
            const transcript = Array.from(e.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');
            console.log(transcript);
            sr.onerror = (e) => {
                console.log('error : ', e.error);
            };
        };
    }

    // function handleSpeechActions(trigger) {
    //     console.log('in handleSpeechAction ********************', { trigger, sr });
    //     switch (trigger) {
    //         case 'record':
    //             setIslistening(true);
    //             sr.start();
    //             sr.onend = () => {
    //                 console.log('continue listening ...');
    //                 sr.start();
    //             };
    //             break;
    //         case 'recPause':
    //             setIsPaused(true);
    //             break;
    //             case 'recResume':
    //             setIsPaused(false);
    //             break;
    //         case 'recStop':
    //             setIslistening(false);
    //             setIsPaused(false);
    //             sr.stop();
    //             console.log('inisde stop >>>>>>>>>>>>>>>>>>.');
    //             sr.onend = () => {
    //                 console.log('stopped record mic off');
    //             };
    //         break;

    //         default:
    //             break;
    //     }
    //     sr.onstart = () => {
    //             console.log('mic on');
    //     };
    //     sr.onresult = (e) => {
    //         const transcript = Array.from(e.results)
    //         .map((result) => result[0])
    //         .map((result) => result.transcript)
    //         .join('');
    //         console.log('out : ', transcript);
    //         sr.onerror = (e) => {
    //             console.log('error : ', e.error);
    //         };
    //     };
    // }

    // useEffect(() => {
    //     handleSpeechActions(trigger);
    // }, [trigger]);

    useEffect(() => {
        handleListen();
    }, [islistening]);
    console.log({ islistening });

  return (
    <div className="p-2 bg-dark rounded-md hover:bg-error">
      {/* {islistening ? <span>🎙️</span> : <span>🛑</span>} */}
      {/* <input type="checkbox" onChange={() => setSpeechMode(!speechMode)} /> */}
      <button type="button" className="" onClick={() => setIslistening((prev) => !prev)}>
        {islistening ? <span>🛑</span> : <span>🎙️</span>}
      </button>
    </div>
  );
}
