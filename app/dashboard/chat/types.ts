export type Msg = { role: "user" | "assistant"; content: string; ts: number };

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

