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

    const context = `
    - Luke is a seasoned professional in the Web and Digital industry with over 20 years of experience since 1999.
    - He holds a degree in Information Technology and has an extensive background in managing and developing web technologies using various Content Management Systems.
    - Luke's expertise also extends to video game development and Quality Assurance.
    - Over the years, Luke has collaborated with development teams of all sizes on projects ranging from tens of thousands to multimillion-dollar enterprise initiatives.
    - He is passionate about projects that enhance collaboration and focus on the human elements of project delivery, ensuring sustainability and healthy work environments.
    - For the last 15 years, Luke has been an agile coach and project manager, deeply involved in digital projects and production.
    - He is a proponent of customer-centric design and works closely with product visionaries to understand user and market needs by collecting and analyzing data for data-driven decision-making.
    - Luke enjoys technical challenges and problem-solving, and he is currently experimenting with development technologies, including creating an AI chatbot using OpenAI.
    - Luke lives in Wellington, New Zealand, with his young family of two boys aged 7 and 11.
    - Luke has worked for a variety of companies, including government agencies, and startups.
    - Luke has worked for Silverstripe, Catalyst, the Department of Internal Affairs, and is currently working at Squiz.net as a Agile Project Manager.
    - Luke has worked for video game studios such as Sidhe (now PikPok), and Synty Studios.
    - Luke has a passion for writing and has published a book called "The Dark that Dwells Beneath Te Aro" which has a 4.5 star review on Amazon and available on spotify and audible as an audio book.
    - Luke is a keen gamer and enjoys playing (and developing) video games in his spare time.
    - Luke has a keen interest in how online technologies can be used to enhance the human experience offline.
    - Luke has a few call out references: "Luke is about as passionate as they come when it comes to deploying agile approaches to projects." Russell Michell, Principal Developer. "As an associate producer, Luke did an excellent job. Always efficient and thorough throughout a very challenging production." Andy Satterthwaite, Executive Producer.
    - Luke worked with the New Zealand Transport Agency to deliver The Security Development Lifecycle Tool (SDLT) project, which was a significant project for the agency to be able to peform Digital Security Risk assessments digitally, saving significant third party vendor costs. 
    - Luke has worked with the Department of Internal Affairs to deliver the Common Web Platform (CWP) project, which was a significant project for the agency to be able to deliver websites for government agencies in a cost effective and secure manner.
    - Luke is a certified Scrum Master and Product Owner, and has been working with Agile methodologies since 2006. Specifically scertied with Scrum Alliance, ICAgile and Scrum.org.
    - Luke considers himself a hobbyist developer, enjoying working with PHP, Javascript, Python and C#. You can see some examples of his code on his GitHub: https://github.com/LukePercy.
    - Lukes contacts are as follows: email at lpercy@ljpercy.com or https://www.linkedin.com/in/lukepercy/
    - Luke is currently experiementing with AI Assistant technologies such as Googles Gemini and OpenAI's GPT-4o.
    - Luke has worked on a number of hobby projects such as a Twitch extension for viewers to collect rewards and digital trading cards while watching Twitch streams, you can read about it here https://www.ljpercy.com/wip/gettingdiceytc.
    The next line is a visitor's question.
    `;
    const fullMessage = `${context} ${input}`;

    try {
      const response = await axios.post('./api/chat', { prompt: fullMessage });
      const botMessage = { sender: 'bot', text: response.data.reply };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setInput('');
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
        </div>
      </div>
    </div>
  );
};

export default Chatty;
