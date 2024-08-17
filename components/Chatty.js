import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';

const Chatty = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
;
    const fullMessage = `${input}`;

    try {
      const response = await axios.post('./api/chat', { prompt: fullMessage });
      const botMessage = { sender: 'bot', text: response.data.reply };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chatty-wrapper">
      <button
        className={`chatty-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '−' : '+'}
      </button>
      <div className={`chatty-container ${isOpen ? 'open' : ''}`}>
        <div className="chatty-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chatty-message ${message.sender}`}
              dangerouslySetInnerHTML={{ __html: message.sender === 'bot' ? marked(message.text) : message.text }}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatty-input">
          <input
            type="text"
            placeholder="Ask about Luke..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatty;
