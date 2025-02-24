import {
    GraphData,
    NodeObject,
    LinkObject,
} from "react-force-graph-2d";

export interface Finding {
    explanation: string;
    summary: string;
}

export type Refs = number[];

export type ChatMessage = {
    text: string;
    sender: "user" | "bot";
    colours: string[];
    nodes: CustomNode[] | null;
}

export interface CommunityReport {
    id: string;
    readable_id: number;
    community: number;
    parent?: number;
    level: number;
    title: string;
    summary: string;
    full_content: string;
    rank: number;
    rank_explanation: string;
    findings: Finding[];
    full_content_json: string;
    period: string;
    size: number;
}

export interface RAGSearchResult {
    response: string;
    context_data: string | Array<Record<string, any>> | Record<string, Array<Record<string, any>>>;
    context_text: string | string[] | Record<string, string>;
    completion_time: number;
    llm_calls: number;
    prompt_tokens: number;
    reduce_context_data?: string | Array<Record<string, any>> | Record<string, Array<Record<string, any>>>;
    reduce_context_text?: string | string[] | Record<string, string>;
    map_responses?: Array<RAGSearchResult>;
}

export interface CustomNode extends NodeObject {
    uuid: string;
    id: string;
    type: string;
    title?: string;
    description?: string;
    readable_id?: number;
    graph_embedding?: number[];
    chunk_ids?: string[];
    description_embedding?: number[];
    neighbors?: CustomNode[];
    links?: CustomLink[];
    text?: string;
    n_tokens?: number;
    document_ids?: string[];
    entity_ids?: string[];
    relationship_ids?: string[];
    level?: number;
    raw_community?: number;
    raw_content?: string;
    rank?: number;
    rank_explanation?: string;
    summary?: string;
    findings?: Finding[]
    full_content?: string;
    explanation?: string;
    subject_id?: string;
    object_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    source_text?: string;
    chunk_id?: string;
    parent?: number;
    lon?: number;
    lat?: number;
    location?: string;
    start_timestamp?: string;
    end_timestamp?: string;
}

export interface CustomLink extends LinkObject {
    source: string;
    target: string;
    type: string;
    weight?: number;
    description?: string;
    chunk_ids?: string[];
    id: string;
    readable_id?: number;
    combined_degree?: number;
    source_degree?: number;
    target_degree?: number;
    rank?: number;
}

export interface CustomGraph extends GraphData {
    nodes: CustomNode[];
    links: CustomLink[];
}

export interface APICallResult {
    llm_reply: string;
    plugin_called: string;
    raw_json: RAGSearchResult | VectorSearchResult;
    ref_nodes?: CustomNode[];
}

export interface VectorSearchResult {
    embedded_query_vector: number[];
    retrieved_vectors: VectorEntity[];
}

export interface VectorEntity {
    id: string;
    description: string;
    raw_vector: number[];
    pca_vector: number[];
}

export interface ChatbotProps {
  messages: ChatMessage[];
  updateMessages: (newMessages: ChatMessage[]) => void;
}