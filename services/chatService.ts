import { chatWithAgent } from "./agentService";

const CHAT_TIMEOUT_MS = 20000;

export async function chat(
  agentId: string,
  params: { message: string; context?: any },
  timeoutMs: number = CHAT_TIMEOUT_MS,
) {
  return Promise.race([
    chatWithAgent(agentId, params),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("CHAT_TIMEOUT")), timeoutMs),
    ),
  ]);
}

