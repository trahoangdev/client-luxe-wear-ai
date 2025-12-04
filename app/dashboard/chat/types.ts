export interface Citation {
  id: string;
  title?: string;
  fileName?: string;
  page?: number;
  line?: number;
  chunkIndex?: number;
  score: number;
  content?: string;
}

export type Msg = { 
  role: "user" | "assistant"; 
  content: string; 
  ts: number;
  citations?: Citation[];
};

export interface Conversation {
  id: string;
  title: string;
  messages: Msg[];
  createdAt: number;
  updatedAt: number;
}

export interface Agent {
  id: string;
  name: string;
}

