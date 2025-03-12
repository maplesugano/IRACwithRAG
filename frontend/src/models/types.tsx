interface VectorEntity {
    id: string;
    title: string;
    text: string;
    type: string;
    raw_vector: number[];
    pca_vector: number[];
}

interface APICallResult {
    llm_reply: string;
    plugin_called: string;
    raw_json: VectorSearchResult;
}

interface VectorSearchResult {
    embedded_query_vector: number[];
    retrieved_vectors: VectorEntity[];
}

interface VectorViewProps {
    vectorDB: VectorEntity[];
    pointRadius?: number;
    pointColor?: string;
    backgroundColor?: string;
    noDataFallback?: React.ReactNode;
    highlightVectors: Set<VectorEntity>;
    nodecolors: { [key: string]: string };
    nodeTextBackground: string;
    handleVectorClick: (node: VectorEntity | null) => void;
}

interface APISearchProps {
    handleApiSearch: (
        query: string
    ) => Promise<APICallResult | null>;
    serverUp: boolean;
    messages: ChatMessage[];
    nodecolors: { [key: string]: string };
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

type ChatMessage = {
    text: string;
    sender: "user" | "bot";
}

type VectorProps = {
    data: VectorEntity[];
    pointRadius: number;
    highlightVectors?: Set<VectorEntity>;
    highlightColor?: string;
    nodecolors: { [key: string]: string };
    nodeTextBackground: string;
    handleVectorClick?: (vector: VectorEntity) => void;
};

export type { VectorEntity, VectorSearchResult, APICallResult, APISearchProps, ChatMessage, VectorViewProps, VectorProps };