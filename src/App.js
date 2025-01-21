import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import 'tailwindcss/tailwind.css';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(null); // Tracks the selected session

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput('');

      try {
        setLoading(true);
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC5jduQVsaRTn7O7fuRSzJfXDSgbQGEs4U',
          {
            contents: [
              {
                parts: [
                  {
                    text: input,
                  },
                ],
              },
            ],
          }
        );
        const botResponse = response.data.candidates[0].content.parts[0].text;
        setLoading(false);
        const newSession = {
          question: input,
          response: botResponse,
        };
        setSessions([...sessions, newSession]);
        setMessages([...newMessages, { text: botResponse, user: false }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setLoading(false);
        setMessages([...newMessages, { text: 'Error: Could not get response from AI', user: false }]);
      }
    }
  };

  const handleSessionClick = (index) => {
    setSelectedSessionIndex(index); // Update selected session index
    const selectedSession = sessions[index];
    if (selectedSession) {
      setMessages([
        { text: selectedSession.question, user: true },
        { text: selectedSession.response, user: false },
      ]);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left Section: Previous Questions */}
      <div className="left-section bg-gray-900 w-1/4 p-4 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold mb-4">Previous Questions</h2>
        <ul className="space-y-2">
          {sessions.map((session, index) => (
            <li
              key={index}
              className={`p-2 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer ${
                selectedSessionIndex === index ? 'bg-gray-700' : ''
              }`}
              onClick={() => handleSessionClick(index)}
            >
              {session.question}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="header p-4 bg-black border-b border-gray-700">
          <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg">AI ChatBot</h1>
        </div>

        {/* Chat Window */}
        <div className="chat-window flex-1 bg-gray-800 overflow-y-auto p-4 custom-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.user ? 'user' : 'bot'} max-w-[70%] p-3 mb-3 rounded-lg shadow-md`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {loading && (
            <div className="loader">
              <div className="box"></div>
              <div className="box"></div>
              <div className="box"></div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="input-bar flex items-center p-4 bg-black border-t border-gray-700">
          <input
            type="text"
            className="input flex-1 p-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-600"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="send-btn p-2 bg-red-600 rounded-lg ml-2" onClick={handleSendMessage}>
            <FaPaperPlane />
          </button>
        </div>

        {/* Footer */}
        <footer className="footer text-center p-4 bg-gray-900">
          Made with ❤️ by Ayush
        </footer>
      </div>
    </div>
  );
}

export default App;
