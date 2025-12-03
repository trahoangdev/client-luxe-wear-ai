import { useState, useEffect } from "react";
import { listAgents } from "@/services/agentService";
import { toast } from "sonner";
import type { Agent } from "../types";

export function useAgents(initialAgentId?: string) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentId, setAgentId] = useState<string>(initialAgentId || "");

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const res = await listAgents({ page: 1, pageSize: 50 });
        const data = (res as { data?: { agents?: Agent[]; data?: { agents?: Agent[] } } }).data;
        const agentsList = data?.agents || data?.data?.agents || [];
        setAgents(agentsList.map((a) => ({ id: a.id, name: a.name })));
        
        if (initialAgentId) {
          setAgentId(initialAgentId);
        } else if (!agentId) {
          const last = typeof window !== "undefined" ? localStorage.getItem("last_agent") : null;
          if (last && agentsList.some((a) => a.id === last)) {
            setAgentId(last);
          } else if (agentsList[0]) {
            setAgentId(agentsList[0].id);
          }
        }
      } catch (e) {
        const err = e as { response?: { data?: { message?: string } }; message?: string };
        toast.error(err.response?.data?.message || err.message || "Failed to load agents");
      }
    };
    // intentionally ignore deps to only run on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadAgents();
  }, []);

  useEffect(() => {
    if (agentId) {
      localStorage.setItem(`last_agent`, agentId);
    }
  }, [agentId]);

  return {
    agents,
    agentId,
    setAgentId,
  };
}

