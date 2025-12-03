import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./rtkBaseQuery";

export interface Agent {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  created_at?: string;
  gradient_color?: string;
  gradient_color_end?: string;
  config?: unknown;
}

export interface AgentsListResponse {
  agents: Agent[];
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
}

export const agentsApi = createApi({
  reducerPath: "agentsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Agents"],
  endpoints: (builder) => ({
    listAgents: builder.query<AgentsListResponse, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 12 } = {}) => ({
        url: "/agents",
        method: "GET",
        params: { page, pageSize },
      }),
      providesTags: (result) =>
        result?.agents
          ? [
              ...result.agents.map((a) => ({ type: "Agents" as const, id: a.id })),
              { type: "Agents" as const, id: "LIST" },
            ]
          : [{ type: "Agents" as const, id: "LIST" }],
    }),
    searchAgents: builder.query<
      AgentsListResponse,
      { q: string; page?: number; pageSize?: number }
    >({
      query: ({ q, page = 1, pageSize = 12 }) => ({
        url: "/agents/search",
        method: "GET",
        params: { q, page, pageSize },
      }),
      providesTags: (result) =>
        result?.agents
          ? [
              ...result.agents.map((a) => ({ type: "Agents" as const, id: a.id })),
              { type: "Agents" as const, id: "LIST" },
            ]
          : [{ type: "Agents" as const, id: "LIST" }],
    }),
  }),
});

export const { useListAgentsQuery, useSearchAgentsQuery } = agentsApi;


