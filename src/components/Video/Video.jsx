import React, { useEffect, useRef, useState } from 'react';
import { FaMicrophone } from "react-icons/fa";
import { IoVolumeMedium } from "react-icons/io5";
import { TiVideo } from "react-icons/ti";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './Video.css'

function Video({clientMessage,setClientMessage,isOpen,setIsOpen,setScript,isListening,setIsListening,setSend}) {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  
  const [speechText,setSpeechText]=useState([]);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.log(err));
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const adjustVolume = (event) => {
    if (audioRef.current) {
      audioRef.current.volume = event.target.value / 100;
    }
  }

  const handleListening = () => {


    if (isListening) {
      SpeechRecognition.stopListening();
      setClientMessage([...clientMessage,transcript]);
      setScript(transcript)
      setSend(true)
    } else {
      
      SpeechRecognition.startListening();
    }
    setIsListening(!isListening);
  }


  const handleClick=()=>{
    setIsOpen(!isOpen);
  }
  return (
    <div className={(isOpen)?'videoComp ' : 'off-videocomp'}>
        <div className={(isOpen)?'video ' : 'off-video'}>
            <video ref={videoRef} autoPlay muted />
        </div>
        <div className={(isOpen)?'off-mic' : 'camera-icon'} onClick={handleClick}>
            < TiVideo className='camera-btn' />
        </div>
        <div className={`mic ${isListening ? 'listening' : ''} ${(isOpen)?'' : 'off-mic'}`} onClick={handleListening}>
             < FaMicrophone className='microphone'/>
             {isListening ? (<h3 className='lish'>Listening</h3>) : <h3 className='speh'>Speak</h3>}
        </div>

        <div className={(isOpen)?'mainVolConatiner' : 'off-mic'}>
            <div className="volContainer">
              <input type="range" min="0" max="100" onChange={adjustVolume} className='vol-slider back-black'/>
              <IoVolumeMedium className='speaker back-black'/>
            </div>
            <div className='volText'>
              <h3>Volume</h3>
            </div>
        </div>
       
    </div>
  )
}

export default Video;




