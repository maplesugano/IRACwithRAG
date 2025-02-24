import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import { APICallResult, ChatbotProps, ChatMessage } from "./api-models";
import agent from "./api-agent";
import ReactMarkdown from "react-markdown";

const Chatbot: React.FC<ChatbotProps> = ({ messages, updateMessages }) => {
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = { text: input, sender: "user", colours: [], nodes: null };
    updateMessages([...messages, newMessage]);
    setInput("");

    // Show "Typing..." message before fetching response
    setIsTyping(true);
    updateMessages([...messages, newMessage, { text: "Typing...", sender: "bot", colours: [], nodes: null }]);

    const result = await handleApiSearch(input);

    setIsTyping(false);
    updateMessages([
      ...messages,
      newMessage,
      { text: result?.llm_reply || "Sorry, I cannot respond to the irrelevant query.", sender: "bot", colours: [], nodes: null },
    ]);
  };

  const handleApiSearch = async (query: string): Promise<APICallResult | null> => {
    try {
      let data: APICallResult = await agent.Search.ask_graph(query);
      return data;
    } catch (err) {
      console.error("An error occurred during the API search.", err);
      return null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === "bot" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {isTyping && <div className="message bot">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={handleSendMessage}>&uarr;</button>
      </div>
    </div>
  );
};

export default Chatbot;
