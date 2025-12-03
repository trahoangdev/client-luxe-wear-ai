"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  listKnowledge,
  searchKnowledge,
  createKnowledge,
  updateKnowledge,
  getKnowledge,
  deleteKnowledge,
  uploadFiles,
  getUploadProgress,
} from "@/services/knowledgeService";
import { retryOnNetworkError, retryOnServerError } from "@/lib/utils/retry";
import { ErrorState } from "@/components/shared/ErrorState";
import { useUrlFilters } from "@/lib/hooks/useUrlFilters";
import { listAgents } from "@/services/agentService";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Upload,
  FileText,
  Download,
  Database,
  Trash2,
  Edit,
  Filter,
  X,
  File,
  CheckCircle2,
  Loader2,
  Calendar,
  User,
  Sparkles,
} from "lucide-react";

export default function KnowledgePage() {
  const params = useSearchParams();
  const lockedAgentId = params.get("agentId");
  
  // URL filters
  const urlFilters = useUrlFilters({
    tab: "list",
    agentId: "all",
    q: "",
    page: "1",
  });

  const [tab, setTab] = useState(urlFilters.getFilter("tab") || "list");

  // list state
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(Number(urlFilters.getFilter("page")) || 1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState(urlFilters.getFilter("q") || "");
  const [agentFilter, setAgentFilter] = useState<string>(lockedAgentId ? lockedAgentId : urlFilters.getFilter("agentId") || "all");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<null | { id: string; title: string }>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  
  // edit state
  const [editingKnowledge, setEditingKnowledge] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMetadata, setEditMetadata] = useState<string>("{}");
  const [loadingKnowledge, setLoadingKnowledge] = useState(false);
  const [updating, setUpdating] = useState(false);

  // add (manual)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [metadata, setMetadata] = useState<string>("{}");
  const [agentId, setAgentId] = useState<string>(lockedAgentId || "none");
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [submitting, setSubmitting] = useState(false);

  // upload
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [uploadDetails, setUploadDetails] = useState<Array<{fileName: string; status: string; percentage: number; error?: string}>>([]);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const res = await listAgents({ page: 1, pageSize: 100 });
        const data = res.data?.agents || res.data?.data?.agents || [];
        setAgents(data.map((a: any) => ({ id: a.id, name: a.name })));
      } catch {}
    };
    if (!lockedAgentId) loadAgents();
  }, [lockedAgentId]);

  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      const agentParam = lockedAgentId ? lockedAgentId : agentFilter === "all" ? undefined : agentFilter;
      if (q.trim()) {
        res = await retryOnNetworkError(
          () => searchKnowledge({ query: q.trim(), limit: perPage, agentId: agentParam }),
          2
        );
        const list = res.data?.results || res.results || [];
        setItems(list);
        setTotal(list.length);
      } else {
        res = await retryOnNetworkError(
          () => listKnowledge({ page, pageSize: perPage, agentId: agentParam }),
          2
        );
        const list = res.data?.knowledge || res.data?.data?.knowledge || [];
        const pagination = res.data?.pagination || res.data?.data?.pagination;
        setItems(list);
        setTotal(pagination?.totalCount || list.length);
      }
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || e?.message || "Failed to load knowledge";
      setError(errorMsg);
      toast.error(errorMsg);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Update URL when filters change
  useEffect(() => {
    if (!lockedAgentId) {
      urlFilters.setFilter("agentId", agentFilter);
    }
  }, [agentFilter, lockedAgentId, urlFilters]);

  useEffect(() => {
    urlFilters.setFilter("q", q);
  }, [q, urlFilters]);

  useEffect(() => {
    urlFilters.setFilter("page", String(page));
  }, [page, urlFilters]);

  useEffect(() => {
    urlFilters.setFilter("tab", tab);
  }, [tab, urlFilters]);

  useEffect(() => {
    load();
  }, [page, perPage, q, agentFilter, lockedAgentId]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 500);
    return () => clearTimeout(t);
  }, [q]);

  const onFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    
    // Prevent duplicate files by checking name and size
    setFiles((prev) => {
      const existingFiles = new Set(prev.map(f => `${f.name}-${f.size}`));
      const uniqueNewFiles = newFiles.filter(f => !existingFiles.has(`${f.name}-${f.size}`));
      return [...prev, ...uniqueNewFiles];
    });
  };

  // Cleanup progress interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);

  const handleUpload = async () => {
    if (files.length === 0 || uploading) return; // Prevent double upload
    
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    setUploading(true);
    setProgress(0);
    
    // Store files to upload (prevent changes during upload)
    const filesToUpload = [...files];
    
    try {
      const form = new FormData();
      filesToUpload.forEach((f) => form.append("files", f));
      if ((lockedAgentId || agentId) && (lockedAgentId || agentId) !== "none") {
        form.append("agentId", (lockedAgentId as string) || agentId);
      }
      
      const res = await uploadFiles(form);
      const sid = res.data?.sessionId || res.sessionId;
      if (!sid) {
        throw new Error("No session ID returned from upload");
      }
      
      setSessionId(sid);
      toast.success("Upload started");
      
      // Track consecutive 404 errors
      let consecutive404Count = 0;
      const MAX_404_RETRIES = 5; // Allow 5 retries for 404 (5 seconds)
      
      // Poll progress
      progressIntervalRef.current = setInterval(async () => {
        try {
          const progressRes = await getUploadProgress(sid);
          
          // Reset 404 counter on success
          consecutive404Count = 0;
          
          // Response structure: { success: true, sessionId: string, progress: UploadProgress[] }
          const progressArray = progressRes.progress || progressRes.data?.progress || [];
          
          if (!Array.isArray(progressArray) || progressArray.length === 0) {
            // If no progress yet, keep waiting
            return;
          }
          
          // Update upload details for UI display
          setUploadDetails(progressArray.map((p: any) => ({
            fileName: p.fileName || p.filename || p.name || "Unknown file",
            status: p.status || "unknown",
            percentage: p.percentage || 0,
            error: p.error || p.message || undefined
          })));
          
          // Calculate average percentage from all files
          const totalPercentage = progressArray.reduce((sum: number, p: any) => {
            const percent = p.percentage || 0;
            return sum + Math.max(0, Math.min(100, percent));
          }, 0);
          const avgPercentage = progressArray.length > 0 ? totalPercentage / progressArray.length : 0;
          
          const finalProgress = Math.min(100, Math.max(0, avgPercentage));
          setProgress(finalProgress);
          
          // Check if all files are completed
          const allCompleted = progressArray.every((p: any) => 
            p.status === "completed" || p.status === "success" || (p.percentage || 0) >= 100
          );
          const hasError = progressArray.some((p: any) => 
            p.status === "error" || p.status === "failed" || p.status === "failure"
          );
          const allProcessing = progressArray.every((p: any) => 
            p.status === "processing" || p.status === "uploading" || p.status === "pending"
          );
          
          // Collect error details for better user feedback
          const errorFiles = progressArray.filter((p: any) => 
            p.status === "error" || p.status === "failed" || p.status === "failure"
          ).map((p: any) => ({
            fileName: p.fileName || p.filename || "Unknown file",
            error: p.error || p.message || "Processing failed"
          }));
          
          // If all completed or progress is 100%, finish
          if (allCompleted || (finalProgress >= 100 && !allProcessing)) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            setUploading(false);
            setProgress(100);
            
            if (hasError && errorFiles.length > 0) {
              // Show detailed error messages
              toast.error(
                `Upload failed: ${errorFiles.length} file(s) could not be processed. ${errorFiles[0].error}`,
                { duration: 5000 }
              );
              console.error("Upload errors:", errorFiles);
            } else if (hasError) {
              toast.warning("Upload completed with some errors. Please check the files.");
            } else {
              toast.success("Upload completed successfully");
            }
            
            // Clear files and reset file input
            setFiles([]);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            
            // Clear upload details after a delay
            setTimeout(() => {
              setUploadDetails([]);
            }, 3000);
            
            // Wait a bit for server to process, then refresh and switch to list tab
            setTimeout(() => {
              setPage(1); // Reset to first page
            load();
              setTab("list"); // Switch to list tab to see new entries
              // Reset progress after switching tabs
              setTimeout(() => setProgress(0), 500);
            }, 1500);
          }
        } catch (error: any) {
          // Handle 404 - session might not be ready yet or was cleaned up
          if (error?.response?.status === 404) {
            consecutive404Count++;
            
            // If we get too many 404s, assume upload completed and session was cleaned up
            if (consecutive404Count >= MAX_404_RETRIES) {
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
              }
              setUploading(false);
              setProgress(100);
              toast.warning("Upload session ended. Please check if files were processed successfully.");
              setFiles([]);
              setUploadDetails([]);
              
              // Refresh list after a delay
              setTimeout(() => {
                setPage(1);
                load();
                setTab("list");
                setTimeout(() => setProgress(0), 500);
              }, 1000);
            } else {
              // Still retrying, just log
              console.debug(`Progress session not found (${consecutive404Count}/${MAX_404_RETRIES}), retrying...`);
            }
          } else if (error?.response?.status >= 400) {
            // Other errors - stop polling
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          setUploading(false);
            toast.error("Failed to get upload progress");
            console.error("Progress polling error:", error);
          }
        }
      }, 1000); // Poll every 1 second
      
    } catch (e: any) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setUploading(false);
      setProgress(0);
      setUploadDetails([]);
      toast.error(e?.response?.data?.message || e?.message || "Upload failed");
    }
  };

  const handleCreate = async () => {
    // server doc indicates content is not accepted here; still include metadata/title
    setSubmitting(true);
    try {
      let meta: any = {};
      try { meta = metadata ? JSON.parse(metadata) : {}; } catch { toast.error("Metadata must be valid JSON"); setSubmitting(false); return; }
      const res = await createKnowledge({ title, metadata: meta, agentId: lockedAgentId ? lockedAgentId : (agentId !== "none" ? agentId : null) });
      if (res.success) {
        toast.success("Knowledge created");
        setTitle("");
        setContent("");
        setMetadata("{}");
        load();
        setTab("list");
      } else {
        toast.error(res.message || "Failed to create knowledge");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to create knowledge");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (knowledge: any) => {
    setEditingKnowledge(knowledge);
    // Initialize with current data
    setEditTitle(knowledge.title || "");
    try {
      // Try to parse metadata if it's already a string, otherwise stringify
      const currentMeta = typeof knowledge.metadata === 'string' 
        ? JSON.parse(knowledge.metadata) 
        : (knowledge.metadata || {});
      setEditMetadata(JSON.stringify(currentMeta, null, 2));
    } catch {
      setEditMetadata("{}");
    }
    
    setLoadingKnowledge(true);
    try {
      // Fetch full knowledge details for latest data
      const res = await getKnowledge(knowledge.id);
      const data = res.data || res;
      setEditTitle(data.title || "");
      try {
        const fetchedMeta = typeof data.metadata === 'string'
          ? JSON.parse(data.metadata)
          : (data.metadata || {});
        setEditMetadata(JSON.stringify(fetchedMeta, null, 2));
      } catch {
        setEditMetadata("{}");
      }
    } catch (e: any) {
      // If fetch fails, use the data we already have
      console.warn("Could not fetch knowledge details:", e?.message);
    } finally {
      setLoadingKnowledge(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingKnowledge) return;
    
    setUpdating(true);
    try {
      let meta: any = {};
      try {
        meta = editMetadata ? JSON.parse(editMetadata) : {};
      } catch {
        toast.error("Metadata must be valid JSON");
        setUpdating(false);
        return;
      }
      
      const res = await updateKnowledge(editingKnowledge.id, {
        title: editTitle,
        metadata: meta,
      });
      
      if (res.success) {
        toast.success("Knowledge updated successfully");
        setEditingKnowledge(null);
        setEditTitle("");
        setEditMetadata("{}");
        load();
      } else {
        toast.error(res.message || "Failed to update knowledge");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to update knowledge");
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Delete ${selectedItems.length} item(s)?`)) return;
    
    setBulkDeleting(true);
    try {
      const deletePromises = selectedItems.map(id => deleteKnowledge(id));
      const results = await Promise.allSettled(deletePromises);
      
      const successCount = results.filter(r => r.status === "fulfilled").length;
      const failCount = results.length - successCount;
      
      if (successCount > 0) {
        toast.success(`Deleted ${successCount} item(s) successfully`);
      }
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} item(s)`);
      }
      
      setSelectedItems([]);
      load();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete items");
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleExport = () => {
    const data = items.map(item => ({
      id: item.id,
      title: item.title || item.fileName || "Untitled",
      content: item.content || item.metadata?.content_preview || "",
      metadata: item.metadata || {},
      agentId: item.agentId,
      agentName: item.agent?.name,
      fileType: item.fileType,
      createdAt: item.createdAt || item.created_at,
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `knowledge-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported successfully");
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(i => i.id));
    }
  };

  const stats = useMemo(() => ({
    total: total,
    byAgent: items.filter((k) => k.agentId || k.agent).length,
    files: items.filter((k) => k.fileName || k.fileType).length,
  }), [items, total]);

  return (
      <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Database className="h-8 w-8 text-primary" />
              Knowledge Base
            </h1>
            <p className="text-muted-foreground mt-1">Manage and organize your knowledge repository</p>
          </div>
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Browse</span>
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
          </TabsList>
        </div>
        {/* List Tab */}
        <TabsContent value="list" className="space-y-6 mt-6">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Knowledge</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Items in your base</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">With Agents</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.byAgent}</div>
                <p className="text-xs text-muted-foreground">Linked to agents</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Files</CardTitle>
                <File className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.files}</div>
                <p className="text-xs text-muted-foreground">Uploaded documents</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find knowledge entries by title, content, or agent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Search knowledge by title, filename, or content..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    aria-label="Search knowledge entries"
                  />
                </div>
          {!lockedAgentId && (
                  <>
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                      <SelectTrigger 
                        className="w-full sm:w-[220px]"
                        aria-label="Filter by agent"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All agents" />
                      </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All agents</SelectItem>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(perPage)} onValueChange={(v) => { setPerPage(parseInt(v)); setPage(1); }}>
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="Per page" />
                      </SelectTrigger>
                <SelectContent>
                        {[10, 20, 30, 50].map((n) => (
                          <SelectItem key={n} value={String(n)}>{n} per page</SelectItem>
                  ))}
                </SelectContent>
              </Select>
                  </>
                )}
            </div>
            </CardContent>
          </Card>

          {/* Knowledge List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Knowledge Entries</CardTitle>
                  <CardDescription>
                    {loading ? "Loading..." : `${items.length} of ${total} entries`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {selectedItems.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={bulkDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete {selectedItems.length}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    disabled={items.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Loading knowledge entries...</p>
                </div>
                ) : error ? (
                <ErrorState
                  title="Failed to load knowledge"
                  description={error}
                  onAction={load}
                  actionLabel="Retry"
                />
                ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No knowledge entries found</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {q.trim() ? "Try adjusting your search terms" : "Get started by creating or uploading knowledge"}
                  </p>
                  {!q.trim() && (
                    <div className="flex gap-2">
                      <Button onClick={() => setTab("add")} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Entry
                      </Button>
                      <Button onClick={() => setTab("upload")}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    </div>
                  )}
                </div>
                ) : (
                <div className="space-y-3">
                  {items.length > 0 && (
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Checkbox
                        checked={selectedItems.length === items.length && items.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                      <span className="text-sm text-muted-foreground">
                        {selectedItems.length > 0 
                          ? `${selectedItems.length} selected`
                          : "Select all"}
                      </span>
                    </div>
                  )}
                  {items.map((k) => (
                    <Card key={k.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <Checkbox
                              checked={selectedItems.includes(k.id)}
                              onCheckedChange={() => toggleSelectItem(k.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-base mb-1 line-clamp-1">
                                    {k.title || k.fileName || "Untitled"}
                                  </h3>
                                  {k.metadata?.content_preview && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                      {k.metadata.content_preview}
                                    </p>
                                  )}
                                  {(k.content || k.metadata?.content) && (
                                    <Collapsible>
                                      <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
                                          {selectedItems.includes(k.id) ? "Hide preview" : "Show preview"}
                                        </Button>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent className="mt-2">
                                        <div className="text-sm text-muted-foreground line-clamp-3 p-2 bg-muted/50 rounded">
                                          {k.content || k.metadata?.content || k.metadata?.content_preview || "No content available"}
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  )}
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                    {k.agent?.name || k.agentId ? (
                                      <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        <span>{k.agent?.name || k.agentId}</span>
                                      </div>
                                    ) : null}
                                    {k.fileType && (
                                      <Badge variant="outline" className="text-xs">
                                        {k.fileType.toUpperCase()}
                                      </Badge>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{new Date(k.createdAt || k.created_at).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(k)}
                              className="h-9"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmDelete({ id: k.id, title: k.title || k.fileName })}
                              className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
          </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {Math.ceil(total / perPage) > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 text-sm">
                <span className="font-medium">Page {page}</span>
                <span className="text-muted-foreground">of</span>
                <span className="font-medium">{Math.ceil(total / perPage)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(Math.ceil(total / perPage), p + 1))}
                disabled={page >= Math.ceil(total / perPage)}
              >
                Next
              </Button>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog open={!!confirmDelete} onOpenChange={(o) => { if (!o) setConfirmDelete(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  Delete Knowledge Entry
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{confirmDelete?.title || "this item"}&quot;</span>? This action cannot be undone.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDelete(null)} disabled={deleting}>Cancel</Button>
                <Button
                  variant="destructive"
                  disabled={deleting}
                  onClick={async () => {
                    if (!confirmDelete) return;
                    
                    const deleteId = confirmDelete.id;
                    const deleteTitle = confirmDelete.title;
                    
                    setDeleting(true);
                    
                    // Optimistic update: remove from UI immediately
                    setItems((prev) => prev.filter((item) => item.id !== deleteId));
                    setTotal((prev) => Math.max(0, prev - 1));
                    setConfirmDelete(null);
                    
                    // Show toast immediately
                    toast.success("Knowledge entry deleted successfully");
                    
                    // Delete in background
                    try {
                      const res = await deleteKnowledge(deleteId);
                      if (!res.success) {
                        // If failed, reload to restore state
                        toast.error(res.message || "Failed to delete");
                        load();
                      }
                    } catch (e: any) {
                      // If failed, reload to restore state
                      toast.error(e?.response?.data?.message || e?.message || "Failed to delete");
                      load();
                    } finally {
                      setDeleting(false);
                    }
                  }}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={!!editingKnowledge} onOpenChange={(o) => { if (!o) { setEditingKnowledge(null); setEditTitle(""); setEditMetadata("{}"); } }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" />
                  Edit Knowledge Entry
                </DialogTitle>
              </DialogHeader>
              {loadingKnowledge ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading knowledge details...</span>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title *</Label>
                    <Input
                      id="edit-title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Enter knowledge title"
                    />
                  </div>
                  {editingKnowledge?.agent?.name || editingKnowledge?.agentId ? (
                    <div className="space-y-2">
                      <Label>Agent</Label>
                      <Input
                        value={editingKnowledge.agent?.name || editingKnowledge.agentId || "-"}
                        readOnly
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Agent cannot be changed after creation</p>
                    </div>
                  ) : null}
                  {editingKnowledge?.fileName && (
                    <div className="space-y-2">
                      <Label>File</Label>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{editingKnowledge.fileName}</span>
                        {editingKnowledge.fileType && (
                          <Badge variant="outline" className="ml-auto">
                            {editingKnowledge.fileType.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">File content cannot be edited. Only title and metadata can be modified.</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="edit-metadata">Metadata (JSON)</Label>
                    <Textarea
                      id="edit-metadata"
                      rows={8}
                      value={editMetadata}
                      onChange={(e) => setEditMetadata(e.target.value)}
                      placeholder='{"tags": ["finance", "important"], "source": "manual", "category": "docs"}'
                      className="font-mono text-sm resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide valid JSON metadata. This will be stored with your knowledge entry.
                    </p>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingKnowledge(null);
                    setEditTitle("");
                    setEditMetadata("{}");
                  }}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={updating || loadingKnowledge || !editTitle.trim()}
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Update
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Add Tab */}
        <TabsContent value="add" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Knowledge Entry
              </CardTitle>
              <CardDescription>
                Manually create a knowledge entry with title and metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter knowledge title"
                  />
            </div>
            <div className="space-y-2">
                  <Label htmlFor="agent">
                    Agent {lockedAgentId ? "(locked)" : "(optional)"}
                  </Label>
              {lockedAgentId ? (
                    <Input value={lockedAgentId} readOnly className="bg-muted" />
              ) : (
                <Select value={agentId} onValueChange={setAgentId}>
                      <SelectTrigger id="agent">
                        <SelectValue placeholder="Select an agent (optional)" />
                      </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No agent</SelectItem>
                    {agents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <div className="space-y-2">
                <Label htmlFor="content">Content (optional)</Label>
                <Textarea
                  id="content"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter knowledge content (optional). For large content, use the Upload tab for better chunking."
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Note: For large documents, use the Upload tab for automatic chunking and processing.
                </p>
          </div>
          <div className="space-y-2">
                <Label htmlFor="metadata">Metadata (JSON)</Label>
                <Textarea
                  id="metadata"
                  rows={5}
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  placeholder='{"tags": ["finance", "important"], "source": "manual", "category": "docs"}'
                  className="font-mono text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Provide valid JSON metadata. This will be stored with your knowledge entry.
                </p>
          </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  setTitle("");
                  setContent("");
                  setMetadata("{}");
                }}>
                  Clear
                </Button>
                <Button onClick={handleCreate} disabled={submitting || !title.trim()}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Create Entry
                    </>
                  )}
                </Button>
          </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Files
              </CardTitle>
              <CardDescription>
                Upload documents to automatically process and chunk them into your knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                  <Label htmlFor="files">Select Files</Label>
                  <div className="relative">
                    <Input
                      ref={fileInputRef}
                      id="files"
                      type="file"
                      multiple
                      onChange={(e) => onFiles(e.target.files)}
                      accept=".pdf,.doc,.docx,.txt,.md,.mdx"
                      className="cursor-pointer"
                    />
                  </div>
              {files.length > 0 && (
                    <Card className="mt-3">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Selected Files ({files.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                    {files.map((f, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm truncate">{f.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {(f.size / 1024).toFixed(1)} KB
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
              )}
            </div>
            <div className="space-y-2">
                  <Label htmlFor="upload-agent">
                    Agent {lockedAgentId ? "(locked)" : "(optional)"}
                  </Label>
              {lockedAgentId ? (
                    <Input value={lockedAgentId} readOnly className="bg-muted" />
              ) : (
                <Select value={agentId} onValueChange={setAgentId}>
                      <SelectTrigger id="upload-agent">
                        <SelectValue placeholder="Select an agent (optional)" />
                      </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No agent</SelectItem>
                    {agents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

              {/* Upload Progress */}
              {(uploading || progress > 0) && (
                <Card>
                  <CardContent className="pt-6">
          <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Upload Progress</span>
                        <span className="text-muted-foreground">{Math.floor(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      {uploading && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processing files...
                        </p>
                      )}
                      
                      {/* File-by-file progress details */}
                      {uploadDetails.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <p className="text-xs font-medium text-muted-foreground">File Details:</p>
                          {uploadDetails.map((detail, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="truncate flex-1 mr-2">{detail.fileName}</span>
                                <span className={`text-xs font-medium ${
                                  detail.status === "completed" || detail.status === "success" 
                                    ? "text-green-600" 
                                    : detail.status === "error" || detail.status === "failed" || detail.status === "failure"
                                    ? "text-red-600"
                                    : "text-blue-600"
                                }`}>
                                  {detail.status === "completed" || detail.status === "success" ? "✓" :
                                   detail.status === "error" || detail.status === "failed" || detail.status === "failure" ? "✗" :
                                   detail.status === "processing" || detail.status === "uploading" ? "⟳" : ""}
                                  {" "}
                                  {Math.floor(detail.percentage)}%
                                </span>
                              </div>
                              {detail.error && (
                                <p className="text-xs text-red-600 bg-red-50 dark:bg-red-950/20 p-2 rounded">
                                  Error: {detail.error}
                                </p>
                              )}
                              {detail.status === "processing" || detail.status === "uploading" ? (
                                <Progress value={detail.percentage} className="h-1" />
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
            </div>
                  </CardContent>
                </Card>
              )}

              <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center bg-muted/20">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Supported Formats</p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX, TXT, MD, MDX. Multiple files supported. Processing continues if one fails.
                </p>
          </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFiles([]);
                    setProgress(0);
                    setUploadDetails([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  disabled={uploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload {files.length > 0 && `(${files.length})`}
                    </>
                  )}
                </Button>
          </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
  );
}
