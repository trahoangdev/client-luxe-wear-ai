import { useEffect, useState } from "react";
import { getAgent } from "@/services/agentService";

export interface UseAgentResult<T = any> {
  agent: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useAgent(id: string | null | undefined): UseAgentResult {
  const [agent, setAgent] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAgent(id);
      setAgent(res.data || res);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Không thể tải thông tin agent"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { agent, loading, error, reload };
}


