import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../Context/UserContext';

export default function Chatbot() {
  const { user } = useContext(UserContext)
  const messages = useRef([{ text: "Hi my name is rBuddy! How can I help you?", sender: "assistant" }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [typing, setTyping] = useState(false)
  const messageBoxRef = useRef();

  const send = async (e) => {
    e.preventDefault();
    if (!user) {
      messages.current = [...messages.current, { text: inputMessage, sender: "user" }];
      setInputMessage('');
      messages.current = [...messages.current, { text: "Please login to use rBuddy!", sender: "assistant" }];
      return;
    }

    if (inputMessage !== '') {
      setTyping(true)
      messages.current = [...messages.current, { text: inputMessage, sender: "user" }];
      setInputMessage('');
      handleResponse(inputMessage);
    }
  };

  const handleResponse = async (message) => {
    const res = await axios.post('http://localhost:4000/api/chatbot/message', { message: message }, { withCredentials: true });
    messages.current = [...messages.current, { text: res.data.message, sender: "assistant" }];
    setTyping(false)
  }

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }

    if (isCollapsed) {
      const timer = setTimeout(() => setShowImage(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowImage(false);
    }
  }, [messages, isCollapsed]);

  return (
    <section>
      <div id="chatbot" className={`main-card ${isCollapsed ? 'collapsed' : ''}`}>
        <button id="chatbot_toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div>
            {showImage && <img alt="" src={require("../Components/images/rBuddy.png")} />}
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M15 4v7H5.17l-.59.59-.58.58V4h11m1-2H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm5 4h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z" />
          </div>
          {!isCollapsed && <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              style={{ color: "#000054" }}
            />
          </svg>}
        </button>
        <div className="main-title">
          <div>
            <img alt="" src={require("../Components/images/rBuddy.png")} />
          </div>
          <span>rBuddy</span>
        </div>
        <div className="chat-area" id="message-box" ref={messageBoxRef}>
          {messages.current.map((message, index) => (
            <div key={index} className={`chat-message-div ${(message.sender === 'user') ? 'chat-message-sent' : 'chat-message-received'}`}>
              {message.text}
            </div>
          ))}
        </div>
        {typing && <div class="indicator ml-4">
          <svg
            version="1.1"
            id="L4"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink='http://www.w3.org/1999/xlink'
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            xmlSpace='preserve'
            className="typing"
          >
            <circle fill="#FAC800" stroke="none" cx="6" cy="50" r="6">
              <animate
                attributeName="opacity"
                dur="1s"
                values="0;1;0"
                repeatCount="indefinite"
                begin="0.1"
              />
            </circle>
            <circle fill="#FAC800" stroke="none" cx="26" cy="50" r="6">
              <animate
                attributeName="opacity"
                dur="1s"
                values="0;1;0"
                repeatCount="indefinite"
                begin="0.2"
              />
            </circle>
            <circle fill="#FAC800" stroke="none" cx="46" cy="50" r="6">
              <animate
                attributeName="opacity"
                dur="1s"
                values="0;1;0"
                repeatCount="indefinite"
                begin="0.3"
              />
            </circle>
          </svg>
          <div className='text-gray-800'>rBuddy is typing</div>
        </div>}
        <div className="input-div">
          <input
            className="input-message"
            name="message"
            type="text"
            id="message"
            placeholder="Type your message ..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={typing}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                send(e);
              }
            }}
          />
          <button className="input-send" disabled={typing} onClick={(e) => { send(e) }}>
            <svg style={{ width: "24px", height: "24px" }}>
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}