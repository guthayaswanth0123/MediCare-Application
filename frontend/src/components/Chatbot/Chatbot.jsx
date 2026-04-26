import React, { useState, useRef, useEffect } from 'react';
import { Stethoscope, User, Send, Paperclip } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Doctor. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    // For displaying in UI
    const displayMessage = { 
      role: 'user', 
      content: selectedImage ? (input || "Uploaded an image") : input,
      image: selectedImage
    };

    setMessages((prev) => [...prev, displayMessage]);

    // Prepare Gemini user parts
    const userParts = [];
    if (selectedImage) {
      // Extract base64 and mimetype
      const base64Data = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(';')[0].split(':')[1];
      userParts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }
    userParts.push({ text: input || "What's in this image?" });

    const currentInput = input;
    const currentImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: 'You are a helpful and knowledgeable AI Doctor assisting users on a medical platform. You provide general health guidance and answer medical queries responsibly.' }]
          },
          contents: [
            { role: 'user', parts: userParts }
          ]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        const botText = data.candidates[0].content.parts[0].text;
        setMessages((prev) => [...prev, { role: 'assistant', content: botText }]);
      } else {
        console.error("Gemini API Error:", data);
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble understanding right now. Please try again later.' }]);
      }
    } catch (error) {
      console.error('Error fetching from Groq API:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error connecting to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-header-avatar">
                <Stethoscope size={20} color="white" />
              </div>
              <div>
                <h3>AI Assistant</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <button onClick={toggleChat} className="close-btn">&times;</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="message-avatar bot-avatar">
                    <Stethoscope size={16} />
                  </div>
                )}
                <div className={`message ${msg.role}`}>
                  {msg.image && (
                    <img src={msg.image} alt="Uploaded attachment" className="message-image" />
                  )}
                  <div className="message-content">
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper assistant">
                <div className="message-avatar bot-avatar">
                  <Stethoscope size={16} />
                </div>
                <div className="message assistant">
                  <div className="message-content typing">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-area">
            {selectedImage && (
              <div className="image-preview-container">
                <img src={selectedImage} alt="Preview" className="image-preview" />
                <button type="button" onClick={removeSelectedImage} className="remove-image-btn">&times;</button>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="chatbot-input-form">
              <div className="chatbot-input-container">
                <button type="button" className="attach-btn" title="Attach file or image" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip size={18} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
              </div>
              <button type="submit" disabled={isLoading || (!input.trim() && !selectedImage)} className="send-btn">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
      {!isOpen && (
        <button onClick={toggleChat} className="chatbot-toggle-btn" aria-label="Open AI Assistant">
          <Stethoscope size={32} color="white" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
