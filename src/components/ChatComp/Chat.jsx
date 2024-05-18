import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { BsChatLeftFill } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
function Chat({
  isOpen,
  setIsOpen,
  token,
  messagerecieve,
  messagesent,
  setScript,
  setSend,
}) {
  const [chatArray, setChatArray] = useState([]);
  const messageEndRef = useRef(null);
  const fetchPrevChats = async () => {
    try {
      const accessToken = token; // Replace with your actual access token
      const apiUrl = "https://server-chat-app-trkp.onrender.com/api/chat/fetch"; // Replace with your API endpoint
  
      const axiosConfig = {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json", // Adjust content type based on your API
        },
      };
  
      const response = await axios.get(apiUrl, axiosConfig);
      console.log("Response:", response.data);
      // Handle the response data here
      setChatArray(response.data.chats);
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 500) {
        // Handle server error here
        console.error("Server error:", error.response.data);
      }
    }
  };
  

  useEffect(() => {
    fetchPrevChats();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messagerecieve, messagesent]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={isOpen ? "chatSection " : "off-chatSection"}>
      <div className={isOpen ? "chat" : "off-chat"}>
        <ScrollToBottom className="upper">
          <div className="clientMessage">
            {chatArray.map((msg) => {
              return (
                <div className={`${msg.type ? "right" : "left"} messagediv `}>
                  <p className="messagep">{msg.message}</p>
                </div>
              );
            })}
          </div>
        </ScrollToBottom>

        {isOpen && (
          <div className="chatIcon" onClick={handleClick}>
            <BsChatLeftFill className="chatBtn" />
          </div>
        )}
      </div>

      {!isOpen && (
        <div className="textBox">
          <input
            value={messagesent}
            onChange={(e) => {
              setScript(e.target.value);
            }}
            type="text"
            name="textBox"
          ></input>
          <GrAttachment className="attachment" />
          <IoIosSend
            onClick={() => {
              setSend(true);
            }}
            className="send"
          />
        </div>
      )}
    </div>
  );
}

export default Chat;
