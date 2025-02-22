import React, { useState } from "react";
import Chatbot from "./components/Chatbot";
import "./App.css";

const App: React.FC = () => {
  const [topics, setTopics] = useState<string[]>(["Topic 1"]);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const handleNewTopic = () => {
    const newTopic = `Topic ${topics.length + 1}`;
    setTopics([...topics, newTopic]);
    setActiveTopic(newTopic);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <button className="new-topic-btn" onClick={handleNewTopic}>
          +
        </button>
        <ul className="topics-list">
          {topics.map((topic, index) => (
            <li
              key={index}
              className={activeTopic === topic ? "active" : ""}
              onClick={() => setActiveTopic(topic)}
            >
              {topic}
            </li>
          ))}
        </ul>
      </aside>
      <main className="chat-container">
        <Chatbot />
      </main>
    </div>
  );
};

export default App;
