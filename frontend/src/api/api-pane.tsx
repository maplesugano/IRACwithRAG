import { useState } from 'react';
import { APISearchProps, ChatMessage } from '../models/types';
import { Link, Alert } from "@mui/material";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React from 'react';

const APISearchPane: React.FC<APISearchProps> = ({
    handleApiSearch,
    serverUp,
    isDarkMode,
    messages,
    nodecolors,
    setMessages,
}) => {
    const [query, setQuery] = useState('');

    const sendMessage = async () => {
        if (query.trim()) {
            const userMessage: ChatMessage = { text: query, sender: 'user' };
            setMessages([...messages, userMessage]);
            setQuery('');
            await handleSearch(query);
        }
    };

    const handleSearch = async (searchQuery: string) => {
        try {
            const response = await handleApiSearch(searchQuery);  // Now it correctly receives a value
            if (response?.llm_reply) {  // Optional chaining avoids undefined errors
                const botMessage: ChatMessage = { text: response.llm_reply, sender: 'bot' };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            }
        } catch {
            console.error('Error occurred during API search');
        }
    };

    return (
        <aside className={`chat-pane ${'open'}`} style={{ backgroundColor: "#3a3a3a", borderRight: "#444"}}>
            {!serverUp && (
                <Alert severity="error" sx={{ mt: 1 }}>
                    Server is not running. Please start the server to use the API.
                    Follow the instructions at{" "}
                    <Link
                        href="https://github.com/maplesugano/IRACwithRAG"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        IRACwithRAG/backend
                    </Link>
                    .
                </Alert>
            )}
            <div className="messages">
                {messages.map((msg, index) => {
                    const background = msg.sender === 'bot' ? "#e0e0e0" : "#ff9933";
                    const textColor = msg.sender === 'bot' ? "black" : "#fff";
                    return <div key={index} className={`message ${msg.sender}`} style={{ display: 'inline', backgroundColor: background, color: textColor}}>
                        {msg.sender === 'bot' ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ children }) => <p>{children}</p>,
                                    section: () => null
                                }}
                            >
                                {msg.text}
                            </ReactMarkdown>
                        ) : (
                            <span>{msg.text}</span>
                        )}
                    </div>
                })}
            </div>
            <div className="chat-input" style={{ backgroundColor: "#2c2c2c", borderTop: "#444"}}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a message..."
                    style={{ backgroundColor: "#3a3a3a", border: "#444", color: "#fff"}}
                />
                <button
                    onClick={sendMessage}
                    disabled={!serverUp}
                    style={{ backgroundColor: "#ff9933", color: "#fff"}}
                >Send</button>
            </div>
        </aside>
    );
}

export default APISearchPane;