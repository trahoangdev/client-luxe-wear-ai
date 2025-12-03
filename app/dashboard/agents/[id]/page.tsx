"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// Tabs removed; we will render by URL tab param
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getAgent, updateAgent, deleteAgent, regenerateApiKey, togglePublic } from "@/services/agentService";
import { getAgentAnalytics } from "@/services/analyticsService";
import { listKnowledge } from "@/services/knowledgeService";
import EmbedChatWidget from "@/components/dashboard/EmbedChatWidget";
import { Copy, Check, Info, AlertCircle, ExternalLink, Code2, Globe, FileCode, Database, BarChart2, Loader2 } from "lucide-react";
import { retryOnNetworkError } from "@/lib/utils/retry";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";

export default function AgentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = String(params?.id || "");
  const currentTab = (searchParams?.get("tab") || "config") as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [allowedOrigins, setAllowedOrigins] = useState<string[]>([]);
  const [newOrigin, setNewOrigin] = useState("");

  const [model, setModel] = useState("gemini-1.5-pro");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(2048);
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [analytics, setAnalytics] = useState<any | null>(null);

  // Knowledge tab state
  const [knowledgeCount, setKnowledgeCount] = useState(0);
  const [recentKnowledge, setRecentKnowledge] = useState<any[]>([]);
  const [loadingKnowledge, setLoadingKnowledge] = useState(false);

  // Analytics tab state
  const [analyticsSummary, setAnalyticsSummary] = useState({
    totalQueries: 0,
    avgResponseTime: 0,
    successRate: 0,
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await retryOnNetworkError(
          () => getAgent(agentId),
          2
        );
        const data = res.data || res;
        setName(data.name || "");
        setDescription(data.description || "");
        const cfg = data.config || {};
        setModel(cfg.model || "gemini-1.5-pro");
        setTemperature(typeof cfg.temperature === "number" ? cfg.temperature : 0.7);
        setMaxTokens(typeof cfg.maxTokens === "number" ? cfg.maxTokens : 2048);
        setSystemPrompt(cfg.systemPrompt || "");
        setInstructions(cfg.instructions || "");
        setIsPublic(Boolean(data.isPublic ?? data.is_public));
        setAllowedOrigins((data.allowedOrigins ?? data.allowed_origins) || []);
        // Set API key if available (only shown once after regeneration)
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
      } catch (e: any) {
        const errorMsg = e?.response?.data?.message || e?.message || "Failed to load agent";
        setError(errorMsg);
        toast.error(errorMsg);
        // Don't redirect immediately, show error state instead
      } finally {
        setLoading(false);
      }
      try {
        const a = await retryOnNetworkError(
          () => getAgentAnalytics(agentId),
          2
        );
        setAnalytics(a.data || a);
      } catch {}
    };
    if (agentId) load();
  }, [agentId, router]);

  // Load knowledge when knowledge tab is active
  useEffect(() => {
    if (currentTab === "knowledge" && agentId) {
      setLoadingKnowledge(true);
      retryOnNetworkError(
        () => listKnowledge({ agentId, pageSize: 10 }),
        2
      )
        .then((res) => {
          const list = res.data?.knowledge || res.data?.data?.knowledge || [];
          setKnowledgeCount(list.length);
          setRecentKnowledge(list.slice(0, 5));
        })
        .catch((e) => {
          console.error("Failed to load knowledge:", e);
          setKnowledgeCount(0);
          setRecentKnowledge([]);
        })
        .finally(() => {
          setLoadingKnowledge(false);
        });
    }
  }, [currentTab, agentId]);

  // Load analytics summary when analytics tab is active
  useEffect(() => {
    if (currentTab === "analytics" && agentId) {
      setLoadingAnalytics(true);
      retryOnNetworkError(
        () => getAgentAnalytics(agentId),
        2
      )
        .then((res) => {
          const data = res.data || res;
          setAnalyticsSummary({
            totalQueries: data.totalQueries || 0,
            avgResponseTime: data.avgResponseTime || 0,
            successRate: data.successRate || 0,
          });
        })
        .catch((e) => {
          console.error("Failed to load analytics:", e);
          setAnalyticsSummary({ totalQueries: 0, avgResponseTime: 0, successRate: 0 });
        })
        .finally(() => {
          setLoadingAnalytics(false);
        });
    }
  }, [currentTab, agentId]);

  // Load knowledge when knowledge tab is active
  useEffect(() => {
    if (currentTab === "knowledge" && agentId) {
      setLoadingKnowledge(true);
      retryOnNetworkError(
        () => listKnowledge({ agentId, pageSize: 10 }),
        2
      )
        .then((res) => {
          const list = res.data?.knowledge || res.data?.data?.knowledge || [];
          setKnowledgeCount(list.length);
          setRecentKnowledge(list.slice(0, 5));
        })
        .catch((e) => {
          console.error("Failed to load knowledge:", e);
          setKnowledgeCount(0);
          setRecentKnowledge([]);
        })
        .finally(() => {
          setLoadingKnowledge(false);
        });
    }
  }, [currentTab, agentId]);

  // Load analytics summary when analytics tab is active
  useEffect(() => {
    if (currentTab === "analytics" && agentId) {
      setLoadingAnalytics(true);
      retryOnNetworkError(
        () => getAgentAnalytics(agentId),
        2
      )
        .then((res) => {
          const data = res.data || res;
          setAnalyticsSummary({
            totalQueries: data.totalQueries || 0,
            avgResponseTime: data.avgResponseTime || 0,
            successRate: data.successRate || 0,
          });
        })
        .catch((e) => {
          console.error("Failed to load analytics:", e);
          setAnalyticsSummary({ totalQueries: 0, avgResponseTime: 0, successRate: 0 });
        })
        .finally(() => {
          setLoadingAnalytics(false);
        });
    }
  }, [currentTab, agentId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name,
        description,
        config: { model, temperature, maxTokens, systemPrompt, instructions },
      };
      const res = await updateAgent(agentId, payload);
      if (res.success) {
        toast.success("Agent updated");
        setEditMode(false);
      } else {
        toast.error(res.message || "Failed to update agent");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to update agent");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateKey = async () => {
    try {
      const res = await regenerateApiKey(agentId);
      const data = res.data || res;
      if (res.success || data.apiKey) {
        setApiKey(data.apiKey || null);
        setShowApiKey(true);
        toast.success("API key regenerated - copy it now");
      } else {
        toast.error(res.message || "Failed to regenerate key");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to regenerate key");
    }
  };

  const handleTogglePublic = async (checked: boolean) => {
    try {
      const res = await togglePublic(agentId, checked, allowedOrigins);
      if (res.success) {
        setIsPublic(checked);
        toast.success("Public status updated");
        // Reload agent data to get updated values
        const reloadRes = await getAgent(agentId);
        const reloadData = reloadRes.data || reloadRes;
        setAllowedOrigins((reloadData.allowedOrigins ?? reloadData.allowed_origins) || []);
        setIsPublic(Boolean(reloadData.isPublic ?? reloadData.is_public));
      } else {
        toast.error(res.message || "Failed to update public status");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to update public status");
    }
  };

  const normalizeOrigin = (input: string): string => {
    const v = input.trim();
    if (!v) return "";
    
    // If already has protocol, parse as URL
    if (v.startsWith("http://") || v.startsWith("https://")) {
      try {
        const url = new URL(v);
        return `${url.protocol}//${url.host}`;
      } catch {
        return v; // Return as-is if parsing fails
      }
    }
    
    // If no protocol, assume http:// and add it
    // This handles cases like "localhost:3001" or "example.com:8080"
    try {
      const url = new URL(`http://${v}`);
      return `http://${url.host}`; // This preserves port (e.g., localhost:3001)
    } catch {
      // If parsing fails, just prepend http://
      return `http://${v}`;
    }
  };

  const addOrigin = () => {
    const v = newOrigin.trim();
    if (!v) return;
    
    const normalized = normalizeOrigin(v);
    
    if (allowedOrigins.includes(normalized)) {
      toast.info("Origin already added");
      setNewOrigin("");
      return;
    }
    if (allowedOrigins.length >= 10) {
      toast.error("Maximum 10 origins");
      return;
    }
    setAllowedOrigins((prev) => [...prev, normalized]);
    setNewOrigin("");
    toast.success("Origin added");
  };

  const removeOrigin = async (origin: string) => {
    // Save current state for potential revert
    const previousOrigins = [...allowedOrigins];
    const updatedOrigins = allowedOrigins.filter((o) => o !== origin);
    
    // Optimistic update
    setAllowedOrigins(updatedOrigins);
    
    // Auto-save after remove
    try {
      const res = await updateAgent(agentId, { allowed_origins: updatedOrigins, is_public: isPublic });
      if (res.success || res.data) {
        toast.success("Origin removed and saved");
        // Reload agent data to get updated allowed_origins from database
        const reloadRes = await getAgent(agentId);
        const reloadData = reloadRes.data || reloadRes;
        setAllowedOrigins((reloadData.allowedOrigins ?? reloadData.allowed_origins) || []);
        setIsPublic(Boolean(reloadData.isPublic ?? reloadData.is_public));
      } else {
        toast.error(res.message || "Failed to remove origin");
        // Revert on error
        setAllowedOrigins(previousOrigins);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to remove origin");
      // Revert on error
      setAllowedOrigins(previousOrigins);
    }
  };

  const saveOrigins = async () => {
    try {
      // Auto-add origin from input if exists and not empty
      let finalOrigins = [...allowedOrigins];
      if (newOrigin.trim()) {
        const normalized = normalizeOrigin(newOrigin);
        if (normalized && !finalOrigins.includes(normalized)) {
          if (finalOrigins.length >= 10) {
            toast.error("Maximum 10 origins. Please remove one before adding.");
            return;
          }
          finalOrigins.push(normalized);
          setAllowedOrigins(finalOrigins);
          setNewOrigin("");
          toast.success("Origin auto-added");
        } else if (normalized && finalOrigins.includes(normalized)) {
          // Origin already in list, just clear input
          setNewOrigin("");
        }
      }

      if (finalOrigins.length === 0) {
        toast.error("Please add at least one origin");
        return;
      }

      const res = await updateAgent(agentId, { allowed_origins: finalOrigins, is_public: isPublic });
      if (res.success || res.data) {
        toast.success("Origins saved");
        // Reload agent data to get updated allowed_origins from database
        const reloadRes = await getAgent(agentId);
        const reloadData = reloadRes.data || reloadRes;
        setAllowedOrigins((reloadData.allowedOrigins ?? reloadData.allowed_origins) || []);
        setIsPublic(Boolean(reloadData.isPublic ?? reloadData.is_public));
      } else {
        toast.error(res.message || "Failed to save origins");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to save origins");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 bg-muted rounded animate-pulse" />
        <div className="h-6 w-24 bg-muted rounded animate-pulse" />
        <div className="h-64 w-full bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{name || "Agent"}</h1>
          <p className="text-sm text-muted-foreground">Manage configuration, API key, knowledge and analytics</p>
        </div>
        {currentTab === "config" && (
          <div className="flex gap-2">
            <Button variant={editMode ? "secondary" : "outline"} onClick={() => setEditMode((v) => !v)}>
              {editMode ? "Cancel" : "Enable edit"}
            </Button>
            <Button onClick={handleSave} disabled={!editMode || saving}>{saving ? "Saving..." : "Save"}</Button>
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>Delete Agent</Button>
          </div>
        )}
      </div>

      {currentTab === "config" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!editMode} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={setModel} disabled={!editMode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1.5-pro">gemini-1.5-pro</SelectItem>
                  <SelectItem value="gemini-2.5-flash">gemini-2.5-flash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={!editMode} rows={3} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input type="number" step={0.1} min={0} max={2} value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} disabled={!editMode} />
            </div>
            <div className="space-y-2">
              <Label>Max tokens</Label>
              <Input type="number" min={1} max={4096} value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))} disabled={!editMode} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>System prompt</Label>
            <Textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} disabled={!editMode} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Instructions</Label>
            <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} disabled={!editMode} rows={3} />
          </div>
        </div>
      )}

      {currentTab === "api" && (
        <div className="space-y-4">
          <div className="rounded-2xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">API Key</div>
                <div className="text-xs text-muted-foreground">Keep it secret. Regenerate to revoke old key.</div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRegenerateKey} variant="outline">Regenerate API Key</Button>
                <Button onClick={() => { if (apiKey) { navigator.clipboard.writeText(apiKey); toast.success("Copied"); } }} disabled={!apiKey}>
                  Copy key
                </Button>
              </div>
            </div>
            {apiKey && (
              <div className="rounded-md bg-muted p-3 text-sm break-all">
                {showApiKey ? apiKey : "••••••••••••••••••••••••••••••"}
                <Button variant="ghost" className="ml-2 h-6 px-2" onClick={() => setShowApiKey((v) => !v)}>
                  {showApiKey ? "Hide" : "Show"}
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Public access</div>
                <div className="text-xs text-muted-foreground">Enable to allow usage from external origins</div>
              </div>
              <Switch checked={isPublic} onCheckedChange={handleTogglePublic} />
            </div>
            {isPublic && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input placeholder="https://example.com or localhost:3001" value={newOrigin} onChange={(e) => setNewOrigin(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addOrigin(); }} />
                  <Button variant="outline" onClick={addOrigin} disabled={!newOrigin.trim()}>Add</Button>
                  <Button onClick={saveOrigins} disabled={!newOrigin.trim() && allowedOrigins.length === 0}>
                    Save
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    Allowed Origins ({allowedOrigins.length}/10)
                  </div>
                  {allowedOrigins.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No origins configured. Add at least one origin to enable public access.</p>
                  ) : (
                    <div className="space-y-2">
                      {allowedOrigins.map((o) => (
                        <div key={o} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm bg-muted/50">
                          <span className="font-mono text-xs">{o}</span>
                          <Button variant="ghost" size="sm" onClick={() => { removeOrigin(o); }}>Remove</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="rounded-md border p-3 text-xs">
                  <div className="font-medium mb-1">Embed snippet</div>
                  {!isPublic || allowedOrigins.length === 0 ? (
                    <div className="text-orange-600">Warning: Enable public and configure allowed origins to use the snippet.</div>
                  ) : (
                    <pre className="whitespace-pre-wrap break-words">{`<script>
async function chatWithAgent(message){
  const res = await fetch('${process.env.NEXT_PUBLIC_SERVER_URL || "https://server-luxe-wear-ai.onrender.com"}/api/public/agents/${agentId}/chat',{
    method:'POST',
    headers:{'Content-Type':'application/json','X-API-Key':'YOUR_API_KEY'},
    body: JSON.stringify({ message })
  });
  const data = await res.json();
  return data?.data?.response;
}
</script>`}</pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {currentTab === "embed" && (
        <div className="space-y-6">
          {/* Requirements Alert */}
          {(!isPublic || allowedOrigins.length === 0) && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                  <div className="flex-1">
                    <CardTitle className="text-base text-amber-900 dark:text-amber-100">Cấu hình cần thiết</CardTitle>
                    <CardDescription className="text-amber-700 dark:text-amber-300 mt-1">
                      Để sử dụng Embed Widget, bạn cần:
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                {!isPublic && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    <span>Bật chế độ Public cho agent này (trong tab API & Security)</span>
                  </div>
                )}
                {allowedOrigins.length === 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    <span>Thêm domain của website vào Allowed Origins (trong tab API & Security)</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Preview Widget
              </CardTitle>
              <CardDescription>
                Xem trước widget sẽ hiển thị trên website của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border bg-muted/30">
                <iframe
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL || "https://server-luxe-wear-ai.onrender.com"}/api/public/widget/${agentId}${apiKey ? `?apiKey=${apiKey}` : ""}`}
                  title="Agent Chat Widget"
                  className="w-full h-[520px]"
                  allow="microphone"
                />
              </div>
            </CardContent>
          </Card>

          {/* Integration Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Hướng dẫn tích hợp
              </CardTitle>
              <CardDescription>
                Chọn phương pháp phù hợp với website của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="iframe" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="iframe">Iframe Embed</TabsTrigger>
                  <TabsTrigger value="script">Script Tag</TabsTrigger>
                </TabsList>

                {/* Iframe Method */}
                <TabsContent value="iframe" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Phương pháp 1: Iframe (Đơn giản nhất)</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Dán code này vào bất kỳ đâu trong HTML của website bạn. Phù hợp cho WordPress, HTML tĩnh, hoặc bất kỳ nền tảng nào.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Code để copy:</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const code = `<div style="position:relative;width:100%;max-width:380px;height:600px;border-radius:12px;overflow:hidden;margin:0 auto;">
  <iframe
    src="${process.env.NEXT_PUBLIC_SERVER_URL || "https://server-luxe-wear-ai.onrender.com"}/api/public/widget/${agentId}${apiKey ? `?apiKey=${apiKey}` : ""}"
    style="width:100%;height:100%;border:none;"
    allow="microphone"
    title="AI Chat Assistant"
  ></iframe>
</div>`;
                            navigator.clipboard.writeText(code);
                            setCopiedCode("iframe");
                            toast.success("Đã copy code!");
                            setTimeout(() => setCopiedCode(null), 2000);
                          }}
                        >
                          {copiedCode === "iframe" ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          Copy Code
                        </Button>
                      </div>
                      <pre className="rounded-md border bg-muted/50 p-4 text-xs overflow-x-auto">
                        <code>{`<div style="position:relative;width:100%;max-width:380px;height:600px;border-radius:12px;overflow:hidden;margin:0 auto;">
  <iframe
    src="${process.env.NEXT_PUBLIC_SERVER_URL || "https://server-luxe-wear-ai.onrender.com"}/api/public/widget/${agentId}${apiKey ? `?apiKey=${apiKey}` : ""}"
    style="width:100%;height:100%;border:none;"
    allow="microphone"
    title="AI Chat Assistant"
  ></iframe>
</div>`}</code>
                      </pre>
                    </div>

                    <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/20 p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <div className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
                          <p className="font-medium">Cách sử dụng:</p>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Copy code ở trên</li>
                            <li>Dán vào vị trí bạn muốn hiển thị widget trong HTML</li>
                            <li>Điều chỉnh width và height nếu cần (mặc định: 380px x 600px)</li>
                            <li>Lưu và publish website</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Script Tag Method */}
                <TabsContent value="script" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Phương pháp 2: Script Tag (Floating Widget)</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Thêm script này vào cuối trang (trước thẻ &lt;/body&gt;) để tạo widget nổi ở góc màn hình.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Code để copy:</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const code = `<script>
  (function() {
    var container = document.createElement('div');
    container.id = 'luxewear-chat-widget';
    container.style.cssText = 'position:fixed;bottom:20px;right:20px;width:380px;height:600px;z-index:9999;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
    var iframe = document.createElement('iframe');
    iframe.src = '${process.env.NEXT_PUBLIC_SERVER_URL || "https://server-luxe-wear-ai.onrender.com"}/api/public/widget/${agentId}${apiKey ? `?apiKey=${apiKey}` : ""}';
    iframe.style.cssText = 'width:100%;height:100%;border:none;';
    iframe.setAttribute('allow', 'microphone');
    iframe.setAttribute('title', 'AI Chat Assistant');
    container.appendChild(iframe);
    document.body.appendChild(container);
  })();
</script>`;
                            navigator.clipboard.writeText(code);
                            setCopiedCode("script");
                            toast.success("Đã copy code!");
                            setTimeout(() => setCopiedCode(null), 2000);
                          }}
                        >
                          {copiedCode === "script" ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          Copy Code
                        </Button>
                      </div>
                      <pre className="rounded-md border bg-muted/50 p-4 text-xs overflow-x-auto">
                        <code>{`<script>
  (function() {
    var container = document.createElement('div');
    container.id = 'luxewear-chat-widget';
    container.style.cssText = 'position:fixed;bottom:20px;right:20px;width:380px;height:600px;z-index:9999;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
    var iframe = document.createElement('iframe');
    iframe.src = '${process.env.NEXT_PUBLIC_SERVER_URL || "https://server-luxe-wear-ai.onrender.com"}/api/public/widget/${agentId}${apiKey ? `?apiKey=${apiKey}` : ""}';
    iframe.style.cssText = 'width:100%;height:100%;border:none;';
    iframe.setAttribute('allow', 'microphone');
    iframe.setAttribute('title', 'AI Chat Assistant');
    container.appendChild(iframe);
    document.body.appendChild(container);
  })();
</script>`}</code>
                      </pre>
                    </div>

                    <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/20 p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <div className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
                          <p className="font-medium">Cách sử dụng:</p>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Copy code ở trên</li>
                            <li>Dán vào cuối trang HTML, ngay trước thẻ &lt;/body&gt;</li>
                            <li>Widget sẽ tự động xuất hiện ở góc dưới bên phải</li>
                            <li>Bạn có thể tùy chỉnh vị trí bằng cách thay đổi bottom và right trong CSS</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Thông tin bổ sung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">API Key</h4>
                <p className="text-muted-foreground">
                  {apiKey ? (
                    <>API Key của bạn: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{apiKey}</code></>
                  ) : (
                    "Bạn cần tạo API Key trong tab API & Security để sử dụng widget."
                  )}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Allowed Origins</h4>
                <p className="text-muted-foreground mb-2">
                  Đảm bảo bạn đã thêm domain của website vào danh sách Allowed Origins. Ví dụ:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li><code>https://yourdomain.com</code></li>
                  <li><code>https://www.yourdomain.com</code></li>
                  <li><code>http://localhost:3000</code> (cho development)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tùy chỉnh kích thước</h4>
                <p className="text-muted-foreground">
                  Bạn có thể thay đổi width và height trong code để phù hợp với thiết kế website của mình. 
                  Kích thước mặc định là 380px x 600px.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "knowledge" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Knowledge Base
                  </CardTitle>
                  <CardDescription>
                    {loadingKnowledge ? "Loading..." : `${knowledgeCount} knowledge entries`}
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href={`/dashboard/knowledge?agentId=${agentId}`}>
                    Manage Knowledge
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingKnowledge ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentKnowledge.length === 0 ? (
                <EmptyState
                  title="No knowledge entries"
                  description="Add knowledge to help your agent answer questions better"
                  icon={<Database className="h-12 w-12" />}
                  actionLabel="Add Knowledge"
                  onAction={() => router.push(`/dashboard/knowledge?agentId=${agentId}`)}
                />
              ) : (
                <div className="space-y-3">
                  <div className="text-sm font-medium">Recent Knowledge Entries</div>
                  <div className="space-y-2">
                    {recentKnowledge.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{item.title || "Untitled"}</div>
                          {item.content && (
                            <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {item.content.substring(0, 100)}...
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="ml-2 shrink-0"
                        >
                          <Link href={`/dashboard/knowledge?agentId=${agentId}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                  {knowledgeCount > recentKnowledge.length && (
                    <div className="text-center pt-2">
                      <Button variant="outline" asChild>
                        <Link href={`/dashboard/knowledge?agentId=${agentId}`}>
                          View All {knowledgeCount} Entries
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "analytics" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5" />
                    Analytics Summary
                  </CardTitle>
                  <CardDescription>
                    Overview of agent performance and usage
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href={`/dashboard/analytics?agentId=${agentId}`}>
                    View Full Analytics
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingAnalytics ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : analyticsSummary.totalQueries === 0 ? (
                <EmptyState
                  title="No analytics data yet"
                  description="Start using this agent to see analytics here"
                  icon={<BarChart2 className="h-12 w-12" />}
                  actionLabel="Go to Chat"
                  onAction={() => router.push(`/dashboard/chat?agentId=${agentId}`)}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{analyticsSummary.totalQueries.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total Queries</div>
                      </CardContent>
                    </Card>
                    {analyticsSummary.avgResponseTime > 0 && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">{analyticsSummary.avgResponseTime.toFixed(1)}s</div>
                          <div className="text-xs text-muted-foreground mt-1">Avg Response Time</div>
                        </CardContent>
                      </Card>
                    )}
                    {analyticsSummary.successRate > 0 && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">{analyticsSummary.successRate.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground mt-1">Success Rate</div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/dashboard/analytics?agentId=${agentId}`}>
                        View Detailed Analytics & Charts
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "chat" && (
        <div className="space-y-4">
          <div className="rounded-2xl border p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-medium">Chat with this agent</div>
                <div className="text-xs text-muted-foreground">Test your agent directly here or open full chat experience</div>
              </div>
              <Button variant="outline" onClick={() => router.push(`/dashboard/chat?agentId=${agentId}`)}>
                Open Full Chat
              </Button>
            </div>
            <div className="h-[600px]">
              <EmbedChatWidget agentId={agentId} agentName={name || "Agent"} />
            </div>
          </div>
        </div>
      )}

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  const res = await deleteAgent(agentId);
                  if (res.success) {
                    toast.success("Agent deleted");
                    router.push("/dashboard");
                  } else {
                    toast.error(res.message || "Failed to delete agent");
                  }
                } catch (e: any) {
                  toast.error(e?.response?.data?.message || e?.message || "Failed to delete agent");
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

