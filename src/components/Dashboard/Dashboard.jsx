import React, { useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import Video from "../Video/Video";
import Chat from "../ChatComp/Chat";
import Navbar from "../Navbar/Navbar";
import { LuPause } from "react-icons/lu";
import { useState } from "react";

import io from "socket.io-client";
import "./Dashboard.css";

function Dashboard({token}) {
  const [isOpen, setIsOpen] = useState(true);
  const [clientMessage, setClientMessage] = useState([]);
  const [socket, setSocket] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState("");
  const [recognizedText, setRecognizedText] = useState("");
  const [script, setScript] = useState("");
  const [send, setSend] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatArray, setChatArray] = useState([]);
  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    const newSocket = io("https://server-chat-app-trkp.onrender.com", {
      query: {
        authToken: token,
      },
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const onSpeak = async (message) => {
    speak({ text: message });
  };

  useEffect(() => {
    if (socket) {
      socket.on("messageFromServer", (data) => {
        const { token1, resp } = data;
        let tokenPart = token;
        if (tokenPart !== null) tokenPart = tokenPart.split(" ")[1];
        console.log("data from server", data.token, tokenPart);

        let outerDiv = document.querySelector(".clientMessage");

        if (outerDiv) {
          if (toString(token1) == toString(tokenPart)) {
            setReceivedMessage(resp);
            onSpeak(resp);
            let newMessageDiv = document.createElement("div");
            newMessageDiv.className = "left messagediv";

            let messageParagraph = document.createElement("p");

            messageParagraph.className = "messagep";
            messageParagraph.textContent = resp; // Use textContent to set text

            newMessageDiv.appendChild(messageParagraph);
            outerDiv.appendChild(newMessageDiv);
          } else {
            console.log("you are not allowed");
          }
        }
      });
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket) {
      socket.emit("messageFromClient", script);
      let outerDiv = document.querySelector(".clientMessage");

      if (outerDiv) {
        let newMessageDiv = document.createElement("div");
        newMessageDiv.className = "right messagediv";

        let messageParagraph = document.createElement("p");
        messageParagraph.className = "messagep";
        messageParagraph.textContent = script; 

        newMessageDiv.appendChild(messageParagraph);
        outerDiv.appendChild(newMessageDiv);
      }
    }
    setScript("");
  };
  useEffect(() => {
    if (send) {
      sendMessage();

      setSend(false);
    }
  }, [send]);

  return (
    <div className="Dashboard">
    <Navbar />
    <div className="bodyContainer">
     <div className="leftContainer">

    {isOpen ? (
      <Video
        clientMessage={clientMessage}
        setClientMessage={setClientMessage}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        script={script}
        setScript={setScript}
        isListening={isListening}
        setIsListening={setIsListening}
        send={send}
        setSend={setSend}
      />
    ) : (
      <Chat
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        token={token}
        messagerecieve={receivedMessage}
        messagesent={script}
        setScript={setScript}
        setSend={setSend}
      />
    )}

    <div className="lower">
      {!isOpen ? (
        <Video
          clientMessage={clientMessage}
          setClientMessage={setClientMessage}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          script={script}
          setScript={setScript}
        />
      ) : (
        <Chat
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          token={token}
          messagerecieve={receivedMessage}
          messagesent={script}
          setScript={setScript}
          setSend={setSend}
        />
      )}

      <div className={isOpen ? `pauseIcon` : `off-pauseIcon`}  >
         <div className="pauseUpper" style={{background:"red"}} >
            <LuPause className="pausebtn " />
          </div>
      </div>
    </div>
    </div>
    </div>
  </div>
  );
}

export default Dashboard;
