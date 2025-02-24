import React, { useState } from "react";
import Chatbot from "./components/Chatbot";
import "./App.css";
import { ChatMessage } from "./components/api-models";

const App: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string>("Topic 1");
  const [topics, setTopicsDic] = useState<{ [key: string]: ChatMessage[] }>({
    "Topic 1": [],
  });

  const handleNewTopic = () => {
    const newTopic = `Topic ${Object.keys(topics).length + 1}`;
    setTopicsDic((prevTopics) => ({ ...prevTopics, [newTopic]: [] }));
    setActiveTopic(newTopic);
  };

  const updateMessages = (newMessages: ChatMessage[]) => {
    setTopicsDic((prevTopics) => ({
      ...prevTopics,
      [activeTopic]: newMessages,
    }));
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <button className="new-topic-btn" onClick={handleNewTopic}>
          +
        </button>
        <ul className="topics-list">
          {Object.keys(topics).map((topic) => (
            <li
              key={topic}
              className={activeTopic === topic ? "active" : ""}
              onClick={() => setActiveTopic(topic)}
            >
              {topic}
            </li>
          ))}
        </ul>
      </aside>
      <main className="chat-container">
        <Chatbot
          messages={topics[activeTopic] || []}
          updateMessages={updateMessages}
        />
      </main>
    </div>
  );
};

export default App;
