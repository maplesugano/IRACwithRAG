import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'; // Import tooltip styles
import VectorView from './components/vectorview';
import { APICallResult, VectorSearchResult, VectorEntity, ChatMessage } from './models/types';
import agent from "./api/agent";
import APISearchPane from './api/api-pane';
import { fetchCSV } from './utils/vectordb';

const App: React.FC = () => {
    // graph components
    const [vectordb, setVectordb] = useState<VectorEntity[] | null>(null);
    
    const nodecolor_scheme: { [key: string] : string } = {
        "STATUTORY PROVISION": "#3366cc",
        "LEGAL INSTRUMENT": "#cc9933",
        "LEGAL PRINCIPLE": "#cc4d33",
        "PROCEDURE RULE": "#9933cc",
    };

    // chatbot components
    const [serverUp, setServerUp] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // highlights 
    const [highlightVectors, setHighlightVectors] = useState<Set<VectorEntity>>(new Set());
    const [rawVectordb, setRawVectordb] = useState<VectorEntity[] | null>(null);


    const resetHistory = async () => {
        try {
            const response = await agent.Switch.reset();
        } catch (error) {
            console.log("Error resetting history");
        }
    };

    useEffect(() => {
        const loadVectors = async () => {
            const initVectorDB = await fetchCSV("output.csv")
            setRawVectordb(initVectorDB);
        };
        loadVectors();
    }, []);

    const handleVectorClick = useCallback((vec: VectorEntity | null) => {
        console.log("vector clicked!", vec?.id);
        if (vec?.text) {
            alert(vec.text);
        }
    }, []);

    const initialVec = useRef<VectorEntity[] | null>(null);

    useEffect(() => {
        if (rawVectordb) {
            setVectordb(rawVectordb);
            initialVec.current = rawVectordb;
        }
    }, [rawVectordb]);

    const handleApiSearch = async (
        query: string
    ): Promise<APICallResult | null> => {
        try {
            const data = await agent.Search.ask(query);
            console.log(data);
            if (data.plugin_called === "vectorRAG") {
                const extractedData = (data.raw_json as VectorSearchResult);
                const newHighlightVectors = new Set<VectorEntity>();
                extractedData.retrieved_vectors.forEach((vec) => {
                    const vector = vectordb?.find((v) => String(v.id) === String(vec.id));
                    if (vector) {
                        newHighlightVectors.add(vector);
                    }
                });
                setHighlightVectors(newHighlightVectors);
            }
            return data;
        } catch (err) {
            console.error("An error occurred during the API search.", err);
            return null;
        }
    };

    const checkServerStatus = async () => {
        try {
            const response = await agent.Status.check();
            if (response.status === "Server is up and running") {
                setServerUp(true);
            } else {
                setServerUp(false);
            }
        } catch (error) {
            setServerUp(false);
        }
    };

    useEffect(() => {
        checkServerStatus();
    }, []);

    return (
        <div>
            <header className="header" style={{ backgroundColor:"#2c2c2c", borderBottom: "2px solid #444" }}>
                <button data-tooltip-id="tooltip" data-tooltip-html="Refresh the Chat Panel" className="chat-button" onClick={() => resetHistory()} style={{ backgroundColor: "#444", color: "#fff" }}>
                    Refresh
                </button>
            </header>
            <main className="main-content">
                <div className="graph">
                    <VectorView
                        vectorDB={vectordb ? vectordb : []}
                        pointRadius={0.08}
                        pointColor={"#cc6600"}
                        backgroundColor={"#3a3a3a"}
                        highlightVectors={highlightVectors}
                        nodecolors={nodecolor_scheme}
                        nodeTextBackground={"rgba(0, 0, 0, 0.3)"}
                        handleVectorClick={handleVectorClick}
                    />
                </div>
            </main>
            <APISearchPane
                handleApiSearch={handleApiSearch}
                serverUp={serverUp}
                messages={messages}
                nodecolors={nodecolor_scheme}
                setMessages={setMessages}
            />
            <Tooltip id="tooltip" style={{ zIndex: 1001 }} />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);